from __future__ import annotations
from typing import Optional
from sqlmodel import Field, SQLModel
from datetime import date


class TransactionBase(SQLModel):
    description: str
    amount: float
    type: str  # 'income' | 'expense'
    date: date
    is_paid: bool = Field(default=True)
    category_id: int = Field(foreign_key="category.id")
    account_id: int = Field(foreign_key="account.id")


class Transaction(TransactionBase, table=True):
    id: int | None = Field(default=None, primary_key=True)
    user_id: int | None = Field(default=None, foreign_key="user.id")


class CategoryBase(SQLModel):
    name: str
    type: str  # 'income' | 'expense'


class Category(CategoryBase, table=True):
    id: int | None = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")


class CategoryCreate(CategoryBase):
    pass


class AccountBase(SQLModel):
    name: str
    type: str = Field(default="corrente")
    initial_balance: float = 0.0
    color: str = Field(default="#3B82F6")


class Account(AccountBase, table=True):
    id: int | None = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")


class AccountCreate(AccountBase):
    pass


class UserBase(SQLModel):
    email: str = Field(unique=True, index=True)


class User(UserBase, table=True):
    id: int | None = Field(default=None, primary_key=True)
    hashed_password: str


class UserCreate(UserBase):
    password: str


class UserResponse(UserBase):
    id: int


class TransactionCreate(TransactionBase):
    pass
