from pydantic import BaseModel, Field
from datetime import datetime


class CustomerCreate(BaseModel):
    full_name: str = Field(..., min_length=1, max_length=255)
    email: str = Field(..., min_length=1, max_length=255)
    phone_number: str = Field(..., min_length=1, max_length=20)


class CustomerResponse(BaseModel):
    id: int
    full_name: str
    email: str
    phone_number: str
    created_at: datetime

    class Config:
        from_attributes = True

