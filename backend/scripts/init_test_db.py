import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))

from app.config import create_db_and_tables, engine
from app.seed import seed_database


def init_test_database():
    create_db_and_tables(engine)
    seed_database()
    print("Database initialized and seeded successfully")


if __name__ == "__main__":
    init_test_database()