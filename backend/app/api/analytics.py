from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy.sql import func, text
from sqlalchemy import and_, or_, desc, case
from datetime import datetime, timedelta
from typing import Optional
from app.database.database import get_db
from app.models.models import (
    Invoice, Product, Vendor, InvoiceItem, ProductCategory, 
    ProductType, User, Employee, WeightUnit
)

router = APIRouter(prefix="/analytics", tags=["Analytics"])

@router.get("/overview")
def get_analytics_overview(db: Session = Depends(get_db)):
    """Get comprehensive analytics overview for dashboard"""
    
    # Total Sales
    total_sales = db.query(func.sum(Invoice.final_amount)).filter(
        Invoice.payment_status != 'cancelled'
    ).scalar() or 0
    
    # Total Orders
    total_orders = db.query(func.count(Invoice.id)).filter(
        Invoice.payment_status != 'cancelled'
    ).scalar() or 0
    
    # Total Products
    total_products = db.query(func.count(Product.id)).filter(
        Product.is_active == True
    ).scalar() or 0
    
    # Active Customers
    active_customers = db.query(func.count(User.id)).filter(
        User.is_active == True,
        User.is_staff == False
    ).scalar() or 0
    
    # Low Stock Items
    low_stock_items = db.query(func.count(Product.id)).filter(
        Product.quantity <= Product.min_stock_level,
        Product.is_active == True
    ).scalar() or 0
    
    # Today's Sales
    today = datetime.now().date()
    today_sales = db.query(func.sum(Invoice.final_amount)).filter(
        func.date(Invoice.created_at) == today,
        Invoice.payment_status != 'cancelled'
    ).scalar() or 0
    
    # This Month's Sales
    this_month = datetime.now().replace(day=1).date()
    month_sales = db.query(func.sum(Invoice.final_amount)).filter(
        Invoice.created_at >= this_month,
        Invoice.payment_status != 'cancelled'
    ).scalar() or 0
    
    # Average Order Value
    avg_order_value = total_sales / total_orders if total_orders > 0 else 0
    
    return {
        "total_sales": round(total_sales, 2),
        "total_orders": total_orders,
        "total_products": total_products,
        "active_customers": active_customers,
        "low_stock_items": low_stock_items,
        "today_sales": round(today_sales, 2),
        "month_sales": round(month_sales, 2),
        "avg_order_value": round(avg_order_value, 2)
    }

@router.get("/sales-trend")
def get_sales_trend(
    days: int = Query(30, description="Number of days to analyze"),
    db: Session = Depends(get_db)
):
    """Get daily sales trend for the specified period"""
    
    start_date = datetime.now().date() - timedelta(days=days)
    
    sales_data = db.query(
        func.date(Invoice.created_at).label("date"),
        func.sum(Invoice.final_amount).label("total_sales"),
        func.count(Invoice.id).label("order_count")
    ).filter(
        Invoice.created_at >= start_date,
        Invoice.payment_status != 'cancelled'
    ).group_by(func.date(Invoice.created_at)).order_by('date').all()
    
    return {"sales_trend": [
        {
            "date": str(item.date),
            "total_sales": round(item.total_sales, 2),
            "order_count": item.order_count
        } for item in sales_data
    ]}

@router.get("/top-products")
def get_top_products(
    limit: int = Query(10, description="Number of top products to return"),
    db: Session = Depends(get_db)
):
    """Get top-selling products by revenue and quantity"""
    
    top_by_revenue = db.query(
        Product.name,
        Product.barcode,
        ProductCategory.name.label("category"),
        ProductType.name.label("type"),
        func.sum(InvoiceItem.total_price).label("total_revenue"),
        func.sum(InvoiceItem.quantity).label("total_sold")
    ).join(InvoiceItem, Product.id == InvoiceItem.product_id) \
     .join(Invoice, InvoiceItem.invoice_id == Invoice.id) \
     .join(ProductCategory, Product.category_id == ProductCategory.id) \
     .join(ProductType, Product.type_id == ProductType.id) \
     .filter(Invoice.payment_status != 'cancelled') \
     .group_by(Product.id, Product.name, Product.barcode, ProductCategory.name, ProductType.name) \
     .order_by(desc(func.sum(InvoiceItem.total_price))) \
     .limit(limit).all()
    
    return {"top_products": [
        {
            "name": item.name,
            "barcode": item.barcode,
            "category": item.category,
            "type": item.type,
            "total_revenue": round(item.total_revenue, 2),
            "total_sold": item.total_sold
        } for item in top_by_revenue
    ]}

@router.get("/category-performance")
def get_category_performance(db: Session = Depends(get_db)):
    """Get performance analytics by product category"""
    
    category_data = db.query(
        ProductCategory.name.label("category"),
        func.sum(InvoiceItem.total_price).label("total_revenue"),
        func.sum(InvoiceItem.quantity).label("total_sold"),
        func.count(func.distinct(Product.id)).label("product_count"),
        func.avg(InvoiceItem.unit_price).label("avg_price")
    ).join(Product, ProductCategory.id == Product.category_id) \
     .join(InvoiceItem, Product.id == InvoiceItem.product_id) \
     .join(Invoice, InvoiceItem.invoice_id == Invoice.id) \
     .filter(Invoice.payment_status != 'cancelled') \
     .group_by(ProductCategory.name) \
     .order_by(desc(func.sum(InvoiceItem.total_price))).all()
    
    return {"category_performance": [
        {
            "category": item.category,
            "total_revenue": round(item.total_revenue, 2),
            "total_sold": item.total_sold,
            "product_count": item.product_count,
            "avg_price": round(item.avg_price, 2)
        } for item in category_data
    ]}

@router.get("/inventory-analysis")
def get_inventory_analysis(db: Session = Depends(get_db)):
    """Get comprehensive inventory analysis"""
    
    # Stock Status Analysis
    stock_status = db.query(
        func.sum(case(
            (Product.quantity == 0, 1), else_=0
        )).label("out_of_stock"),
        func.sum(case(
            (Product.quantity <= Product.min_stock_level, 1), else_=0
        )).label("low_stock"),
        func.sum(case(
            (Product.quantity > Product.min_stock_level, 1), else_=0
        )).label("in_stock"),
        func.count(Product.id).label("total_products")
    ).filter(Product.is_active == True).first()
    
    # Inventory Value by Category
    inventory_value = db.query(
        ProductCategory.name.label("category"),
        func.sum(Product.total_cost * Product.quantity).label("total_value"),
        func.count(Product.id).label("product_count"),
        func.sum(Product.quantity).label("total_quantity")
    ).join(ProductCategory, Product.category_id == ProductCategory.id) \
     .filter(Product.is_active == True) \
     .group_by(ProductCategory.name).all()
    
    return {
        "stock_status": {
            "out_of_stock": stock_status.out_of_stock or 0,
            "low_stock": stock_status.low_stock or 0,
            "in_stock": stock_status.in_stock or 0,
            "total_products": stock_status.total_products or 0
        },
        "inventory_value": [
            {
                "category": item.category,
                "total_value": round(item.total_value, 2),
                "product_count": item.product_count,
                "total_quantity": item.total_quantity
            } for item in inventory_value
        ]
    }

@router.get("/customer-analytics")
def get_customer_analytics(db: Session = Depends(get_db)):
    """Get customer behavior analytics"""
    
    # Top Customers by Revenue
    top_customers = db.query(
        User.name,
        User.email,
        func.sum(Invoice.final_amount).label("total_spent"),
        func.count(Invoice.id).label("order_count"),
        func.avg(Invoice.final_amount).label("avg_order_value"),
        func.max(Invoice.created_at).label("last_order_date")
    ).join(Invoice, User.id == Invoice.user_id) \
     .filter(Invoice.payment_status != 'cancelled', User.is_staff == False) \
     .group_by(User.id, User.name, User.email) \
     .order_by(desc(func.sum(Invoice.final_amount))) \
     .limit(10).all()
    
    return {"top_customers": [
        {
            "name": item.name,
            "email": item.email,
            "total_spent": round(item.total_spent, 2),
            "order_count": item.order_count,
            "avg_order_value": round(item.avg_order_value, 2),
            "last_order_date": item.last_order_date.isoformat() if item.last_order_date else None
        } for item in top_customers
    ]}

@router.get("/vendor-performance")
def get_vendor_performance(db: Session = Depends(get_db)):
    """Get vendor performance analytics"""
    
    vendor_data = db.query(
        Vendor.name,
        Vendor.contact_number,
        func.count(func.distinct(Product.id)).label("product_count"),
        func.sum(InvoiceItem.total_price).label("total_sales"),
        func.sum(Product.quantity).label("total_inventory"),
        func.avg(Product.sale_price).label("avg_product_price")
    ).join(Product, Vendor.id == Product.vendor_id) \
     .outerjoin(InvoiceItem, Product.id == InvoiceItem.product_id) \
     .outerjoin(Invoice, InvoiceItem.invoice_id == Invoice.id) \
     .filter(
         Vendor.is_active == True,
         or_(Invoice.payment_status != 'cancelled', Invoice.payment_status.is_(None))
     ) \
     .group_by(Vendor.id, Vendor.name, Vendor.contact_number) \
     .order_by(desc(func.sum(InvoiceItem.total_price))).all()
    
    return {"vendor_performance": [
        {
            "name": item.name,
            "contact_number": item.contact_number,
            "product_count": item.product_count,
            "total_sales": round(item.total_sales or 0, 2),
            "total_inventory": item.total_inventory or 0,
            "avg_product_price": round(item.avg_product_price or 0, 2)
        } for item in vendor_data
    ]}

@router.get("/payment-analytics")
def get_payment_analytics(db: Session = Depends(get_db)):
    """Get payment method and status analytics"""
    
    # Payment Method Distribution
    payment_methods = db.query(
        Invoice.payment_method,
        func.sum(Invoice.final_amount).label("total_amount"),
        func.count(Invoice.id).label("transaction_count")
    ).filter(Invoice.payment_status != 'cancelled') \
     .group_by(Invoice.payment_method).all()
    
    # Payment Status Distribution
    payment_status = db.query(
        Invoice.payment_status,
        func.sum(Invoice.final_amount).label("total_amount"),
        func.count(Invoice.id).label("transaction_count")
    ).group_by(Invoice.payment_status).all()
    
    return {
        "payment_methods": [
            {
                "method": item.payment_method or "Not Specified",
                "total_amount": round(item.total_amount, 2),
                "transaction_count": item.transaction_count
            } for item in payment_methods
        ],
        "payment_status": [
            {
                "status": item.payment_status,
                "total_amount": round(item.total_amount, 2),
                "transaction_count": item.transaction_count
            } for item in payment_status
        ]
    }

@router.get("/jewelry-metrics")
def get_jewelry_metrics(db: Session = Depends(get_db)):
    """Get jewelry-specific metrics like metal types, purity, weight analysis"""
    
    # Metal type analysis (based on product types)
    metal_performance = db.query(
        ProductType.name.label("metal_type"),
        func.sum(InvoiceItem.total_price).label("total_revenue"),
        func.sum(InvoiceItem.quantity).label("total_sold"),
        func.avg(Product.purity).label("avg_purity"),
        func.sum(Product.gross_weight * InvoiceItem.quantity).label("total_weight"),
        func.avg(InvoiceItem.unit_price).label("avg_price")
    ).join(Product, ProductType.id == Product.type_id) \
     .join(InvoiceItem, Product.id == InvoiceItem.product_id) \
     .join(Invoice, InvoiceItem.invoice_id == Invoice.id) \
     .filter(Invoice.payment_status != 'cancelled') \
     .group_by(ProductType.name) \
     .order_by(desc(func.sum(InvoiceItem.total_price))).all()
    
    # Purity distribution
    purity_distribution = db.query(
        case(
            (Product.purity >= 22, '22K+'), 
            (Product.purity >= 18, '18-22K'),
            (Product.purity >= 14, '14-18K'),
            (Product.purity >= 10, '10-14K'),
            else_='Below 10K'
        ).label("purity_range"),
        func.count(Product.id).label("product_count"),
        func.sum(Product.quantity).label("total_quantity"),
        func.sum(Product.total_cost * Product.quantity).label("inventory_value")
    ).filter(Product.is_active == True, Product.purity.isnot(None)) \
     .group_by(text("purity_range")).all()
    
    # Weight analysis
    weight_stats = db.query(
        func.sum(Product.gross_weight * Product.quantity).label("total_gross_weight"),
        func.sum(Product.net_weight * Product.quantity).label("total_net_weight"),
        func.sum(Product.beads_weight * Product.quantity).label("total_beads_weight"),
        func.avg(Product.gross_weight).label("avg_gross_weight"),
        func.avg(Product.net_weight).label("avg_net_weight")
    ).filter(Product.is_active == True).first()
    
    # Making charges analysis
    making_charges = db.query(
        func.sum(Product.making_charges * Product.quantity).label("total_making_charges"),
        func.avg(Product.making_charges).label("avg_making_charges"),
        func.sum(Product.wastage_charges * Product.quantity).label("total_wastage_charges"),
        func.avg(Product.wastage_charges).label("avg_wastage_charges")
    ).filter(Product.is_active == True).first()
    
    return {
        "metal_performance": [
            {
                "metal_type": item.metal_type,
                "total_revenue": round(item.total_revenue, 2),
                "total_sold": item.total_sold,
                "avg_purity": round(item.avg_purity or 0, 2),
                "total_weight": round(item.total_weight or 0, 2),
                "avg_price": round(item.avg_price, 2)
            } for item in metal_performance
        ],
        "purity_distribution": [
            {
                "purity_range": item.purity_range,
                "product_count": item.product_count,
                "total_quantity": item.total_quantity,
                "inventory_value": round(item.inventory_value, 2)
            } for item in purity_distribution
        ],
        "weight_stats": {
            "total_gross_weight": round(weight_stats.total_gross_weight or 0, 2),
            "total_net_weight": round(weight_stats.total_net_weight or 0, 2),
            "total_beads_weight": round(weight_stats.total_beads_weight or 0, 2),
            "avg_gross_weight": round(weight_stats.avg_gross_weight or 0, 2),
            "avg_net_weight": round(weight_stats.avg_net_weight or 0, 2)
        },
        "making_charges": {
            "total_making_charges": round(making_charges.total_making_charges or 0, 2),
            "avg_making_charges": round(making_charges.avg_making_charges or 0, 2),
            "total_wastage_charges": round(making_charges.total_wastage_charges or 0, 2),
            "avg_wastage_charges": round(making_charges.avg_wastage_charges or 0, 2)
        }
    }

@router.get("/profitability-analysis")
def get_profitability_analysis(db: Session = Depends(get_db)):
    """Get profitability analysis including margins, costs breakdown"""
    
    # Revenue and cost analysis
    revenue_cost = db.query(
        func.sum(InvoiceItem.total_price).label("total_revenue"),
        func.sum(Product.total_cost * InvoiceItem.quantity).label("total_cost"),
        func.sum(Product.making_charges * InvoiceItem.quantity).label("total_making_charges"),
        func.sum(Product.wastage_charges * InvoiceItem.quantity).label("total_wastage_charges"),
        func.sum(Product.beads_cost * InvoiceItem.quantity).label("total_beads_cost"),
        func.count(InvoiceItem.id).label("total_items_sold")
    ).join(Product, InvoiceItem.product_id == Product.id) \
     .join(Invoice, InvoiceItem.invoice_id == Invoice.id) \
     .filter(Invoice.payment_status != 'cancelled').first()
    
    # Category-wise profitability
    category_profit = db.query(
        ProductCategory.name.label("category"),
        func.sum(InvoiceItem.total_price).label("revenue"),
        func.sum(Product.total_cost * InvoiceItem.quantity).label("cost"),
        func.count(InvoiceItem.id).label("items_sold")
    ).join(Product, ProductCategory.id == Product.category_id) \
     .join(InvoiceItem, Product.id == InvoiceItem.product_id) \
     .join(Invoice, InvoiceItem.invoice_id == Invoice.id) \
     .filter(Invoice.payment_status != 'cancelled') \
     .group_by(ProductCategory.name).all()
    
    total_revenue = revenue_cost.total_revenue or 0
    total_cost = revenue_cost.total_cost or 0
    gross_profit = total_revenue - total_cost
    gross_margin = (gross_profit / total_revenue * 100) if total_revenue > 0 else 0
    
    return {
        "overview": {
            "total_revenue": round(total_revenue, 2),
            "total_cost": round(total_cost, 2),
            "gross_profit": round(gross_profit, 2),
            "gross_margin": round(gross_margin, 2),
            "total_making_charges": round(revenue_cost.total_making_charges or 0, 2),
            "total_wastage_charges": round(revenue_cost.total_wastage_charges or 0, 2),
            "total_beads_cost": round(revenue_cost.total_beads_cost or 0, 2),
            "total_items_sold": revenue_cost.total_items_sold or 0
        },
        "category_profitability": [
            {
                "category": item.category,
                "revenue": round(item.revenue, 2),
                "cost": round(item.cost, 2),
                "profit": round(item.revenue - item.cost, 2),
                "margin": round(((item.revenue - item.cost) / item.revenue * 100) if item.revenue > 0 else 0, 2),
                "items_sold": item.items_sold
            } for item in category_profit
        ]
    }
