from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Boolean, CheckConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from sqlalchemy.ext.declarative import declared_attr
from ..database.database import Base

class TimestampMixin:
    @declared_attr
    def created_at(cls):
        return Column(DateTime(timezone=True), server_default=func.now())

    @declared_attr
    def updated_at(cls):
        return Column(DateTime(timezone=True), onupdate=func.now())

class ProductCategory(Base, TimestampMixin):
    __tablename__ = "product_categories"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)  # e.g., Necklace, Ring, Bracelet
    description = Column(String)
    
    products = relationship("Product", back_populates="category")

class ProductType(Base, TimestampMixin):
    __tablename__ = "product_types"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)  # e.g., Gold, Silver, Diamond
    description = Column(String)
    
    products = relationship("Product", back_populates="type")

class WeightUnit(Base, TimestampMixin):
    __tablename__ = "weight_units"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True)  # gram, carat, milligram
    symbol = Column(String)  # g, ct, mg
    
    products = relationship("Product", back_populates="weight_unit")

class Product(Base, TimestampMixin):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(String)
    barcode = Column(String, unique=True)
    counter_no = Column(String)
    
    # Foreign Keys
    vendor_id = Column(Integer, ForeignKey("vendors.id"))
    category_id = Column(Integer, ForeignKey("product_categories.id"))
    type_id = Column(Integer, ForeignKey("product_types.id"))
    weight_unit_id = Column(Integer, ForeignKey("weight_units.id"))
    
    # Specifications
    purity = Column(Float)  # in karats or percentage
    gross_weight = Column(Float)
    net_weight = Column(Float)
    beads_weight = Column(Float)
    
    # Pricing
    cost_per_unit = Column(Float)  # Base cost per unit of weight
    making_charges = Column(Float)
    wastage_charges = Column(Float)
    beads_cost = Column(Float)
    gst_rate = Column(Float)
    total_cost = Column(Float)  # Calculated field
    sale_price = Column(Float)
    discount_percentage = Column(Float)
    
    # Inventory
    quantity = Column(Integer, default=0)
    min_stock_level = Column(Integer, default=1)
    
    # Timestamps and Status
    is_active = Column(Boolean, default=True)
    
    # Relationships
    vendor = relationship("Vendor", back_populates="products")
    category = relationship("ProductCategory", back_populates="products")
    type = relationship("ProductType", back_populates="products")
    weight_unit = relationship("WeightUnit", back_populates="products")
    invoice_items = relationship("InvoiceItem", back_populates="product")

class Vendor(Base, TimestampMixin):
    __tablename__ = "vendors"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    contact_number = Column(String)
    email = Column(String)
    address = Column(String)
    gst_number = Column(String)
    is_active = Column(Boolean, default=True)

    # Relationships
    products = relationship("Product", back_populates="vendor")

class User(Base, TimestampMixin):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    phone_number = Column(String, unique=True)
    email = Column(String, unique=True, index=True)
    address = Column(String)
    password_hash = Column(String)  # For user authentication
    is_active = Column(Boolean, default=True)
    is_staff = Column(Boolean, default=False)

    # Relationships
    invoices = relationship("Invoice", back_populates="user")

class Employee(Base, TimestampMixin):
    __tablename__ = "employees"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    employee_id = Column(String, unique=True)
    department = Column(String)
    position = Column(String)
    salary = Column(Float)
    join_date = Column(DateTime)

class Invoice(Base, TimestampMixin):
    __tablename__ = "invoices"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    invoice_number = Column(String, unique=True)
    total_amount = Column(Float)
    discount = Column(Float)
    tax = Column(Float)
    final_amount = Column(Float)
    payment_status = Column(String)  # pending, completed, cancelled
    payment_method = Column(String)  # cash, card, upi, etc.

    # Relationships
    user = relationship("User", back_populates="invoices")
    items = relationship("InvoiceItem", back_populates="invoice")

    __table_args__ = (
        CheckConstraint("total_amount >= 0", name="check_total_amount_positive"),
        CheckConstraint("final_amount >= 0", name="check_final_amount_positive"),
    )

class InvoiceItem(Base, TimestampMixin):
    __tablename__ = "invoice_items"

    id = Column(Integer, primary_key=True, index=True)
    invoice_id = Column(Integer, ForeignKey("invoices.id"))
    product_id = Column(Integer, ForeignKey("products.id"))
    quantity = Column(Integer)
    unit_price = Column(Float)
    discount = Column(Float)
    total_price = Column(Float)

    # Relationships
    invoice = relationship("Invoice", back_populates="items")
    product = relationship("Product", back_populates="invoice_items")

    __table_args__ = (
        CheckConstraint("quantity > 0", name="check_quantity_positive"),
        CheckConstraint("total_price >= 0", name="check_total_price_positive"),
    )
