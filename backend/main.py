import logging
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from app.api.vendors import router as vendors_router
from app.api.product_categories import router as product_categories_router
from app.api.product_types import router as product_types_router
from app.api.weight_units import router as weight_units_router
from app.api.products import router as products_router
from app.api.invoices import router as invoices_router
from app.api.invoice_items import router as invoice_items_router
from app.api.users import router as users_router
from app.api.employees import router as employees_router
from app.api.analytics import router as analytics_router
from app.api.miscellaneous import router as miscellaneous_router

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
    handlers=[
        logging.StreamHandler(),
        logging.FileHandler("app.log")
    ]
)
logger = logging.getLogger(__name__)

app = FastAPI()

# Middleware to log incoming requests
@app.middleware("http")
async def log_requests(request: Request, call_next):
    logger.info(f"Incoming request: {request.method} {request.url}")
    response = await call_next(request)
    logger.info(f"Response status: {response.status_code}")
    return response

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(vendors_router)
app.include_router(product_categories_router)
app.include_router(product_types_router)
app.include_router(weight_units_router)
app.include_router(products_router)
app.include_router(invoices_router)
app.include_router(invoice_items_router)
app.include_router(users_router)
app.include_router(employees_router)
app.include_router(analytics_router)
app.include_router(miscellaneous_router)

@app.get("/")
async def root():
    logger.info("Root endpoint accessed.")
    return {"message": "Welcome to Jewelry Store API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    logger.info("Starting application...")
    uvicorn.run(app, host="0.0.0.0", port=8000)
