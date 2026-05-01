#!/usr/bin/env python3
import os
import sys
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Add parent directory to path
sys.path.insert(0, os.path.dirname(__file__))

try:
    from app.config import get_database_url, create_engine_by_url, transform_libsql_url
    from sqlalchemy import text
    
    print("Testing Turso connection...")
    print(f"DATABASE_URL: {os.getenv('DATABASE_URL', 'NOT SET')}")
    print(f"TURSO_AUTH_TOKEN: {'SET' if os.getenv('TURSO_AUTH_TOKEN') else 'NOT SET'}")
    
    # Get the database URL
    db_url = get_database_url()
    print(f"\nResolved DATABASE_URL: {db_url}")
    
    # Test URL transformation for libsql
    if db_url.startswith("libsql"):
        transformed_url, connect_args = transform_libsql_url(db_url)
        print(f"Transformed URL: {transformed_url}")
        print(f"Connect args: {list(connect_args.keys())}")
    
    # Try to create engine
    print("\nCreating engine...")
    engine = create_engine_by_url(db_url)
    print(f"Engine created: {engine}")
    
    # Try to connect
    print("\nTesting connection...")
    with engine.connect() as conn:
        result = conn.execute(text("SELECT 1"))
        print(f"Connection successful! Test query result: {result.fetchone()}")
    
    print("\n✅ Turso connection successful!")
    
except ImportError as e:
    print(f"❌ Import error: {e}")
    print("Make sure to install dependencies: pip install -r requirements.txt")
    sys.exit(1)
except Exception as e:
    print(f"❌ Connection error: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)
except Exception as e:
    print(f"❌ Connection error: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)
