# EcoInventory AI - Backend

This is the backend for the EcoInventory AI system, built with Flask and Python.

## Setup

1. **Prerequisites**: Python 3.8+
2. **Setup Environment**:
   ```bash
   cd eco_inventory/backend
   python -m venv venv
   .\venv\Scripts\activate
   pip install -r requirements.txt
   ```

## Running the Demo

1. **Seed the Database**:
   This creates the test scenario (NY, Brooklyn, Miami stores).
   ```bash
   python seed_data.py
   ```

2. **Run the Server**:
   ```bash
   python app.py
   ```
   The API will be available at `http://localhost:5000`.

## API Endpoints

- `GET /api/stores`: List all stores.
- `GET /api/recommendations`: Trigger optimization and get transfer recommendations.
- `POST /api/feedback`: Submit manager feedback.

## Key Logic

- **Carbon-Aware Logistics**: See `logic.py`. It prioritizes transfers between nearby stores (Haversine distance) to minimize CO2.
- **Test Case**: The seed data forces a situation where Store A (NY) has dead stock, and Store B (Brooklyn) needs it. Store C (Miami) also needs it but is too far. The system recommends A -> B.
