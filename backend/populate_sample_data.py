#!/usr/bin/env python3
"""
Script to populate the database with sample data for jewelry store
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.models.models import ProductCategory, ProductType, WeightUnit, Vendor
from app.database.database import SQLALCHEMY_DATABASE_URL

# Create database engine and session
engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def populate_sample_data():
    db = SessionLocal()
    try:
        # Check if data already exists
        if db.query(ProductCategory).count() > 0:
            print("Sample data already exists, skipping...")
            return

        # Product Categories
        categories = [
            ProductCategory(name="Necklace", description="Necklaces and chains"),
            ProductCategory(name="Ring", description="Rings and bands"),
            ProductCategory(name="Bracelet", description="Bracelets and bangles"),
            ProductCategory(name="Earring", description="Earrings and studs"),
            ProductCategory(name="Pendant", description="Pendants and lockets"),
            ProductCategory(name="Anklet", description="Anklets and toe rings"),
            ProductCategory(name="Nose Ring", description="Nose rings and pins"),
        ]

        # Product Types
        types = [
            ProductType(name="Gold", description="Gold jewelry"),
            ProductType(name="Silver", description="Silver jewelry"),
            ProductType(name="Diamond", description="Diamond jewelry"),
            ProductType(name="Platinum", description="Platinum jewelry"),
            ProductType(name="Rose Gold", description="Rose gold jewelry"),
            ProductType(name="White Gold", description="White gold jewelry"),
            ProductType(name="Kundan", description="Traditional kundan jewelry"),
            ProductType(name="Pearl", description="Pearl jewelry"),
        ]

        # Weight Units
        weight_units = [
            WeightUnit(name="Gram", symbol="g"),
            WeightUnit(name="Carat", symbol="ct"),
            WeightUnit(name="Milligram", symbol="mg"),
            WeightUnit(name="Tola", symbol="tola"),
            WeightUnit(name="Ratti", symbol="ratti"),
        ]

        # Vendors
        vendors = [
            Vendor(
                name="Golden Suppliers Ltd",
                contact_number="9876543210",
                email="contact@goldensuppliers.com",
                address="123 Jewelry Market, Mumbai",
                gst_number="27ABCDE1234F1Z5",
                is_active=True
            ),
            Vendor(
                name="Silver Star Traders",
                contact_number="9876543211",
                email="info@silverstar.com",
                address="456 Silver Street, Delhi",
                gst_number="07BCDEF2345G2Y6",
                is_active=True
            ),
            Vendor(
                name="Diamond Dreams",
                contact_number="9876543212",
                email="sales@diamonddreams.com",
                address="789 Diamond Plaza, Surat",
                gst_number="24CDEFG3456H3X7",
                is_active=True
            ),
            Vendor(
                name="Platinum Paradise",
                contact_number="9876543213",
                email="orders@platinumparadise.com",
                address="321 Platinum Avenue, Bangalore",
                gst_number="29DEFGH4567I4W8",
                is_active=True
            ),
        ]

        # Add all data to session
        db.add_all(categories)
        db.add_all(types)
        db.add_all(weight_units)
        db.add_all(vendors)

        # Commit the transaction
        db.commit()
        print("Sample data populated successfully!")
        print(f"Added {len(categories)} product categories")
        print(f"Added {len(types)} product types")
        print(f"Added {len(weight_units)} weight units")
        print(f"Added {len(vendors)} vendors")

    except Exception as e:
        db.rollback()
        print(f"Error populating data: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    populate_sample_data()
