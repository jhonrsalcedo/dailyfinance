#!/usr/bin/env python3
import os
import sys
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Add parent directory to path
sys.path.insert(0, os.path.dirname(__file__))

try:
    from app.config import get_database_url, create_engine_by_url, create_db_and_tables
    
    print("Creating tables in Turso database...")
    
    # Get the database URL and create engine
    db_url = get_database_url()
    engine = create_engine_by_url(db_url)
    
    # Create all tables
    print("Creating tables...")
    create_db_and_tables(engine)
    
    print("\n✅ Tables created successfully in Turso!")
    print("\nYou can now:")
    print("1. Run the backend: cd backend && python3 -m uvicorn app.main:app --reload")
    print("2. Visit http://localhost:8000/docs to see the API")
    
except Exception as e:
    print(f"❌ Error creating tables: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)
