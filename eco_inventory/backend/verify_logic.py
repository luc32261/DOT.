from app import create_app
from logic import optimize_transfers
from models import TransferRecommendation

app = create_app()

with app.app_context():
    print("Running optimization...")
    transfers = optimize_transfers()
    
    print(f"Generated {len(transfers)} recommendations.")
    
    for t in transfers:
        print(f"Transfer: {t.source_store.name} -> {t.dest_store.name if t.dest_store else 'Online'} | Item: {t.product.name} | CO2 Saved: {t.co2_saved}kg | Dist: {t.method}")
        
    # Validation logic
    # Expect: Store A -> Store B (StoreTransfer)
    found_ny_bk = False
    for t in transfers:
        if t.source_store.name.startswith("Store A") and t.dest_store and t.dest_store.name.startswith("Store B"):
            found_ny_bk = True
            print("SUCCESS: Found transfer from NY to Brooklyn.")
            
    if not found_ny_bk:
        print("FAILURE: Did not find transfer from NY to Brooklyn!")
        exit(1)
        
    # Expect: NO Store A -> Store C (Miami)
    for t in transfers:
        if t.source_store.name.startswith("Store A") and t.dest_store and t.dest_store.name.startswith("Store C"):
            print("FAILURE: Found transfer from NY to Miami (Too far!)")
            exit(1)
            
    print("Verification Passed!")
