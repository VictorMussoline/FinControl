from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from sqlmodel import Session, select
from typing import List
from datetime import timedelta

from database import create_db_and_tables, get_session
from models import (
    Transaction,
    TransactionCreate,
    User,
    UserCreate,
    UserResponse,
    Account,
    AccountCreate,
    Category,
    CategoryCreate,
)
from auth import (
    get_password_hash,
    verify_password,
    create_access_token,
    get_current_user,
    ACCESS_TOKEN_EXPIRE_MINUTES,
)

app = FastAPI(title="FinControl API")

origins = [
    "http://localhost:5173",  # Vite default port
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup():
    create_db_and_tables()


@app.get("/")
def read_root():
    return {"message": "FinControl API is running!"}


@app.get("/api/health")
def health_check():
    return {"status": "ok"}


@app.post(
    "/api/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED
)
def register(user: UserCreate, session: Session = Depends(get_session)):
    existing_user = session.exec(select(User).where(User.email == user.email)).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_password = get_password_hash(user.password)
    db_user = User(email=user.email, hashed_password=hashed_password)
    session.add(db_user)
    session.commit()
    session.refresh(db_user)

    # Seed default categories for new user
    default_categories = [
        Category(name="Alimentação", type="expense", user_id=db_user.id),
        Category(name="Moradia", type="expense", user_id=db_user.id),
        Category(name="Transporte", type="expense", user_id=db_user.id),
        Category(name="Lazer", type="expense", user_id=db_user.id),
        Category(name="Saúde", type="expense", user_id=db_user.id),
        Category(name="Salário", type="income", user_id=db_user.id),
        Category(name="Investimentos", type="income", user_id=db_user.id),
        Category(name="Outros", type="expense", user_id=db_user.id),
        Category(name="Outros", type="income", user_id=db_user.id),
    ]
    for cat in default_categories:
        session.add(cat)
    session.commit()

    return db_user


@app.post("/api/login")
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    session: Session = Depends(get_session),
):
    user = session.exec(select(User).where(User.email == form_data.username)).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}


# --- CATEGORIES ---


@app.post(
    "/api/categories", response_model=Category, status_code=status.HTTP_201_CREATED
)
def create_category(
    category: CategoryCreate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    db_category = Category.model_validate(category, update={"user_id": current_user.id})
    session.add(db_category)
    session.commit()
    session.refresh(db_category)
    return db_category


@app.get("/api/categories", response_model=List[Category])
def read_categories(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    categories = session.exec(
        select(Category).where(Category.user_id == current_user.id)
    ).all()
    return categories


@app.delete("/api/categories/{category_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_category(
    category_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    category = session.get(Category, category_id)
    if not category or category.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Category not found")

    linked_transactions = session.exec(
        select(Transaction).where(Transaction.category_id == category_id)
    ).first()
    if linked_transactions:
        raise HTTPException(
            status_code=400, detail="Cannot delete category with linked transactions"
        )

    session.delete(category)
    session.commit()


# --- ACCOUNTS ---


@app.post("/api/accounts", response_model=Account, status_code=status.HTTP_201_CREATED)
def create_account(
    account: AccountCreate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    db_account = Account.model_validate(account, update={"user_id": current_user.id})
    session.add(db_account)
    session.commit()
    session.refresh(db_account)
    return db_account


@app.get("/api/accounts", response_model=List[Account])
def read_accounts(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    accounts = session.exec(
        select(Account).where(Account.user_id == current_user.id)
    ).all()
    return accounts


@app.put("/api/accounts/{account_id}", response_model=Account)
def update_account(
    account_id: int,
    account_update: AccountCreate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    account = session.get(Account, account_id)
    if not account or account.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Account not found")

    account_data = account_update.model_dump(exclude_unset=True)
    for key, value in account_data.items():
        setattr(account, key, value)

    session.add(account)
    session.commit()
    session.refresh(account)
    return account


@app.delete("/api/accounts/{account_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_account(
    account_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    account = session.get(Account, account_id)
    if not account or account.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Account not found")

    # Check if there are transactions linked to this account
    linked_transactions = session.exec(
        select(Transaction).where(Transaction.account_id == account_id)
    ).first()
    if linked_transactions:
        raise HTTPException(
            status_code=400, detail="Cannot delete account with linked transactions"
        )

    session.delete(account)
    session.commit()


# --- TRANSACTIONS ---


@app.post(
    "/api/transactions", response_model=Transaction, status_code=status.HTTP_201_CREATED
)
def create_transaction(
    transaction: TransactionCreate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    # Validate if account belongs to user
    account = session.get(Account, transaction.account_id)
    if not account or account.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Account not found")

    # Validate if category belongs to user
    category = session.get(Category, transaction.category_id)
    if not category or category.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Category not found")

    db_transaction = Transaction.model_validate(
        transaction, update={"user_id": current_user.id}
    )
    session.add(db_transaction)
    session.commit()
    session.refresh(db_transaction)
    return db_transaction


@app.get("/api/transactions", response_model=List[Transaction])
def read_transactions(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    transactions = session.exec(
        select(Transaction).where(Transaction.user_id == current_user.id)
    ).all()
    return transactions


@app.get("/api/transactions/{transaction_id}", response_model=Transaction)
def read_transaction(
    transaction_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    transaction = session.get(Transaction, transaction_id)
    if not transaction or transaction.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return transaction


@app.put("/api/transactions/{transaction_id}", response_model=Transaction)
def update_transaction(
    transaction_id: int,
    transaction_update: TransactionCreate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    transaction = session.get(Transaction, transaction_id)
    if not transaction or transaction.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Transaction not found")

    transaction_data = transaction_update.model_dump(exclude_unset=True)
    for key, value in transaction_data.items():
        setattr(transaction, key, value)

    session.add(transaction)
    session.commit()
    session.refresh(transaction)
    return transaction


@app.delete(
    "/api/transactions/{transaction_id}", status_code=status.HTTP_204_NO_CONTENT
)
def delete_transaction(
    transaction_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    transaction = session.get(Transaction, transaction_id)
    if not transaction or transaction.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Transaction not found")
    session.delete(transaction)
    session.commit()
