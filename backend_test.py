#!/usr/bin/env python3
"""
Comprehensive Backend API Testing for New Bombay Sweets Website
Tests all CRUD operations for menu management system
"""

import requests
import json
import sys
from typing import Dict, Any, Optional

# Configuration
BASE_URL = "https://bombaysweets.preview.emergentagent.com"
API_BASE = f"{BASE_URL}/api"

class BackendTester:
    def __init__(self):
        self.test_results = {
            "mongodb_connection": {"status": "unknown", "details": []},
            "get_menu": {"status": "unknown", "details": []},
            "post_menu": {"status": "unknown", "details": []},
            "put_menu": {"status": "unknown", "details": []},
            "delete_menu": {"status": "unknown", "details": []},
        }
        self.created_item_id = None
        
    def log_result(self, test_name: str, success: bool, message: str, details: Any = None):
        """Log test result"""
        status = "pass" if success else "fail"
        self.test_results[test_name]["status"] = status
        self.test_results[test_name]["details"].append({
            "message": message,
            "details": details
        })
        print(f"{'✅' if success else '❌'} {test_name}: {message}")
        if details and not success:
            print(f"   Details: {details}")
    
    def test_mongodb_connection_and_get_menu(self):
        """Test MongoDB connection by fetching all menu items"""
        print("\n🔍 Testing MongoDB Connection & GET /api/menu...")
        
        try:
            response = requests.get(f"{API_BASE}/menu", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                
                if isinstance(data, list):
                    item_count = len(data)
                    self.log_result("mongodb_connection", True, 
                                  f"MongoDB connection successful, retrieved {item_count} items")
                    self.log_result("get_menu", True, 
                                  f"GET /api/menu successful - returned {item_count} items")
                    
                    # Validate data structure
                    if item_count > 0:
                        first_item = data[0]
                        required_fields = ['id', 'name', 'category', 'price', 'description', 'image', 'isAvailable']
                        missing_fields = [field for field in required_fields if field not in first_item]
                        
                        if not missing_fields:
                            self.log_result("get_menu", True, "All required fields present in response")
                            
                            # Check if we have the expected 20 seeded items
                            if item_count == 20:
                                self.log_result("get_menu", True, "Correct number of seeded items (20) found")
                            else:
                                self.log_result("get_menu", True, 
                                              f"Found {item_count} items (expected 20 from seeding)")
                        else:
                            self.log_result("get_menu", False, 
                                          f"Missing required fields: {missing_fields}", first_item)
                    
                    return data
                else:
                    self.log_result("mongodb_connection", False, "Response is not an array", data)
                    self.log_result("get_menu", False, "Response is not an array", data)
            else:
                error_msg = f"HTTP {response.status_code}: {response.text}"
                self.log_result("mongodb_connection", False, "Failed to connect to database", error_msg)
                self.log_result("get_menu", False, "GET request failed", error_msg)
                
        except requests.exceptions.RequestException as e:
            error_msg = f"Request failed: {str(e)}"
            self.log_result("mongodb_connection", False, "Connection error", error_msg)
            self.log_result("get_menu", False, "Request error", error_msg)
        
        return None
    
    def test_post_menu(self):
        """Test creating a new menu item"""
        print("\n🔍 Testing POST /api/menu...")
        
        # Test data for new menu item
        test_item = {
            "name": "Test Rasgulla Special",
            "category": "Indian Sweets",
            "price": 55,
            "description": "Special test rasgulla for API testing",
            "image": "https://via.placeholder.com/300x200?text=Test+Rasgulla",
            "isAvailable": True
        }
        
        try:
            # Test successful creation
            response = requests.post(f"{API_BASE}/menu", 
                                   json=test_item, 
                                   headers={'Content-Type': 'application/json'},
                                   timeout=10)
            
            if response.status_code == 201:
                data = response.json()
                
                if 'id' in data and data['name'] == test_item['name']:
                    self.created_item_id = data['id']
                    self.log_result("post_menu", True, 
                                  f"Successfully created menu item with ID: {self.created_item_id}")
                    
                    # Verify all fields are returned correctly
                    for key, value in test_item.items():
                        if data.get(key) != value:
                            self.log_result("post_menu", False, 
                                          f"Field mismatch - {key}: expected {value}, got {data.get(key)}")
                            return
                    
                    self.log_result("post_menu", True, "All fields returned correctly")
                else:
                    self.log_result("post_menu", False, "Invalid response structure", data)
            else:
                self.log_result("post_menu", False, 
                              f"HTTP {response.status_code}: {response.text}")
                
        except requests.exceptions.RequestException as e:
            self.log_result("post_menu", False, f"Request failed: {str(e)}")
        
        # Test validation - missing required fields
        print("\n🔍 Testing POST validation...")
        invalid_item = {"name": "Test Item"}  # Missing category and price
        
        try:
            response = requests.post(f"{API_BASE}/menu", 
                                   json=invalid_item,
                                   headers={'Content-Type': 'application/json'},
                                   timeout=10)
            
            if response.status_code == 400:
                self.log_result("post_menu", True, "Validation correctly rejected invalid data")
            else:
                self.log_result("post_menu", False, 
                              f"Validation failed - expected 400, got {response.status_code}")
                
        except requests.exceptions.RequestException as e:
            self.log_result("post_menu", False, f"Validation test failed: {str(e)}")
    
    def test_put_menu(self):
        """Test updating a menu item"""
        print("\n🔍 Testing PUT /api/menu/:id...")
        
        if not self.created_item_id:
            self.log_result("put_menu", False, "No item ID available for testing (POST test may have failed)")
            return
        
        # Update data
        update_data = {
            "name": "Updated Test Rasgulla Special",
            "price": 65,
            "isAvailable": False,
            "description": "Updated description for testing PUT endpoint"
        }
        
        try:
            response = requests.put(f"{API_BASE}/menu/{self.created_item_id}",
                                  json=update_data,
                                  headers={'Content-Type': 'application/json'},
                                  timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                
                # Verify updates were applied
                for key, value in update_data.items():
                    if data.get(key) != value:
                        self.log_result("put_menu", False, 
                                      f"Update failed - {key}: expected {value}, got {data.get(key)}")
                        return
                
                self.log_result("put_menu", True, 
                              f"Successfully updated menu item {self.created_item_id}")
            else:
                self.log_result("put_menu", False, 
                              f"HTTP {response.status_code}: {response.text}")
                
        except requests.exceptions.RequestException as e:
            self.log_result("put_menu", False, f"Request failed: {str(e)}")
        
        # Test with invalid ID
        print("\n🔍 Testing PUT with invalid ID...")
        try:
            response = requests.put(f"{API_BASE}/menu/invalid_id_123",
                                  json={"name": "Test"},
                                  headers={'Content-Type': 'application/json'},
                                  timeout=10)
            
            if response.status_code == 404:
                self.log_result("put_menu", True, "Correctly returned 404 for invalid ID")
            else:
                self.log_result("put_menu", False, 
                              f"Expected 404 for invalid ID, got {response.status_code}")
                
        except requests.exceptions.RequestException as e:
            self.log_result("put_menu", False, f"Invalid ID test failed: {str(e)}")
    
    def test_delete_menu(self):
        """Test deleting a menu item"""
        print("\n🔍 Testing DELETE /api/menu/:id...")
        
        if not self.created_item_id:
            self.log_result("delete_menu", False, "No item ID available for testing")
            return
        
        try:
            response = requests.delete(f"{API_BASE}/menu/{self.created_item_id}", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if 'message' in data and 'deleted successfully' in data['message'].lower():
                    self.log_result("delete_menu", True, 
                                  f"Successfully deleted menu item {self.created_item_id}")
                else:
                    self.log_result("delete_menu", False, "Unexpected response format", data)
            else:
                self.log_result("delete_menu", False, 
                              f"HTTP {response.status_code}: {response.text}")
                
        except requests.exceptions.RequestException as e:
            self.log_result("delete_menu", False, f"Request failed: {str(e)}")
        
        # Test with invalid ID
        print("\n🔍 Testing DELETE with invalid ID...")
        try:
            response = requests.delete(f"{API_BASE}/menu/invalid_id_123", timeout=10)
            
            if response.status_code == 404:
                self.log_result("delete_menu", True, "Correctly returned 404 for invalid ID")
            else:
                self.log_result("delete_menu", False, 
                              f"Expected 404 for invalid ID, got {response.status_code}")
                
        except requests.exceptions.RequestException as e:
            self.log_result("delete_menu", False, f"Invalid ID test failed: {str(e)}")
    
    def run_all_tests(self):
        """Run all backend tests"""
        print("🚀 Starting Comprehensive Backend API Testing for New Bombay Sweets")
        print(f"🌐 Base URL: {BASE_URL}")
        print(f"🔗 API Base: {API_BASE}")
        print("=" * 70)
        
        # Test in logical order
        menu_items = self.test_mongodb_connection_and_get_menu()
        self.test_post_menu()
        self.test_put_menu()
        self.test_delete_menu()
        
        # Summary
        print("\n" + "=" * 70)
        print("📊 TEST SUMMARY")
        print("=" * 70)
        
        total_tests = 0
        passed_tests = 0
        
        for test_name, result in self.test_results.items():
            status = result["status"]
            total_tests += 1
            if status == "pass":
                passed_tests += 1
                print(f"✅ {test_name.replace('_', ' ').title()}: PASSED")
            elif status == "fail":
                print(f"❌ {test_name.replace('_', ' ').title()}: FAILED")
            else:
                print(f"⚠️  {test_name.replace('_', ' ').title()}: NOT TESTED")
        
        print(f"\n📈 Results: {passed_tests}/{total_tests} tests passed")
        
        if passed_tests == total_tests:
            print("🎉 All backend API tests PASSED!")
            return True
        else:
            print("⚠️  Some tests FAILED - check details above")
            return False

def main():
    """Main test execution"""
    tester = BackendTester()
    success = tester.run_all_tests()
    
    # Exit with appropriate code
    sys.exit(0 if success else 1)

if __name__ == "__main__":
    main()