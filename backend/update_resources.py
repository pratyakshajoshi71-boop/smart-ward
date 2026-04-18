from pymongo import MongoClient

client = MongoClient('mongodb://localhost:27017/')
db = client['smart_ward']
db.resources.update_one({}, {'$set': {'doctors_on_duty': 5, 'nurses_on_duty': 15}})
print("Updated successfully")
