from pydantic import BaseModel

class ProductCategoryBase(BaseModel):
    name: str
    description: str

class ProductCategoryCreate(ProductCategoryBase):
    pass

class ProductCategoryResponse(ProductCategoryBase):
    id: int

    class Config:
        orm_mode = True
