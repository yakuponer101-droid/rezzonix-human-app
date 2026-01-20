#!/usr/bin/env python3
"""
RezzoniX Analyzer Backend API Test Suite
Tests all backend endpoints for functionality and data integrity
"""

import requests
import json
import sys
from datetime import datetime

# Get backend URL from environment
BACKEND_URL = "https://mobile-app-creator-40.preview.emergentagent.com/api"

class RezzoniXTester:
    def __init__(self):
        self.base_url = BACKEND_URL
        self.session = requests.Session()
        self.test_results = []
        self.created_analysis_id = None
        
    def log_test(self, test_name, success, message, response_data=None):
        """Log test results"""
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name}: {message}")
        
        self.test_results.append({
            "test": test_name,
            "success": success,
            "message": message,
            "response_data": response_data,
            "timestamp": datetime.now().isoformat()
        })
        
    def test_health_check(self):
        """Test GET /api/ - Health check endpoint"""
        try:
            response = self.session.get(f"{self.base_url}/")
            
            if response.status_code == 200:
                data = response.json()
                if "message" in data and "RezzoniX Analyzer API" in data["message"]:
                    self.log_test("Health Check", True, f"API responding correctly: {data['message']}")
                    return True
                else:
                    self.log_test("Health Check", False, f"Unexpected response format: {data}")
                    return False
            else:
                self.log_test("Health Check", False, f"HTTP {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Health Check", False, f"Connection error: {str(e)}")
            return False
    
    def test_create_analysis(self):
        """Test POST /api/analysis - Create new analysis"""
        test_data = {
            "patient_name": "Ahmet Yılmaz",
            "patient_age": 35,
            "selected_organs": ["Kalp", "Karaciğer", "Böbrek"],
            "sensor_type": "BLE",
            "sensor_name": "RezzoniX Bio-Sensor X1"
        }
        
        try:
            response = self.session.post(
                f"{self.base_url}/analysis",
                json=test_data,
                headers={"Content-Type": "application/json"}
            )
            
            if response.status_code == 200:
                data = response.json()
                
                # Validate response structure
                required_fields = ["id", "patient_name", "selected_organs", "overall_score", "band", "results"]
                missing_fields = [field for field in required_fields if field not in data]
                
                if missing_fields:
                    self.log_test("Create Analysis", False, f"Missing fields: {missing_fields}")
                    return False
                
                # Validate data integrity
                if data["patient_name"] != test_data["patient_name"]:
                    self.log_test("Create Analysis", False, "Patient name mismatch")
                    return False
                
                if data["selected_organs"] != test_data["selected_organs"]:
                    self.log_test("Create Analysis", False, "Selected organs mismatch")
                    return False
                
                # Validate score ranges
                if not (0 <= data["overall_score"] <= 100):
                    self.log_test("Create Analysis", False, f"Invalid overall score: {data['overall_score']}")
                    return False
                
                # Validate band values
                valid_bands = ["Dengeli", "Takip", "Yüksek takip"]
                if data["band"] not in valid_bands:
                    self.log_test("Create Analysis", False, f"Invalid band: {data['band']}")
                    return False
                
                # Validate organ results
                for result in data["results"]:
                    if not (0 <= result["score"] <= 100):
                        self.log_test("Create Analysis", False, f"Invalid organ score: {result['score']}")
                        return False
                    
                    if not (0 <= result["stress"] <= 10):
                        self.log_test("Create Analysis", False, f"Invalid stress level: {result['stress']}")
                        return False
                
                # Store analysis ID for later tests
                self.created_analysis_id = data["id"]
                
                self.log_test("Create Analysis", True, 
                            f"Analysis created successfully. ID: {data['id']}, Score: {data['overall_score']}, Band: {data['band']}")
                return True
                
            else:
                self.log_test("Create Analysis", False, f"HTTP {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Create Analysis", False, f"Request error: {str(e)}")
            return False
    
    def test_get_all_analyses(self):
        """Test GET /api/analysis - Get all analyses"""
        try:
            response = self.session.get(f"{self.base_url}/analysis")
            
            if response.status_code == 200:
                data = response.json()
                
                if not isinstance(data, list):
                    self.log_test("Get All Analyses", False, "Response is not a list")
                    return False
                
                if len(data) == 0:
                    self.log_test("Get All Analyses", True, "No analyses found (empty database)")
                    return True
                
                # Validate first analysis structure
                first_analysis = data[0]
                required_fields = ["id", "patient_name", "overall_score", "band", "results"]
                missing_fields = [field for field in required_fields if field not in first_analysis]
                
                if missing_fields:
                    self.log_test("Get All Analyses", False, f"Missing fields in analysis: {missing_fields}")
                    return False
                
                self.log_test("Get All Analyses", True, f"Retrieved {len(data)} analyses successfully")
                return True
                
            else:
                self.log_test("Get All Analyses", False, f"HTTP {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Get All Analyses", False, f"Request error: {str(e)}")
            return False
    
    def test_get_single_analysis(self):
        """Test GET /api/analysis/{id} - Get specific analysis"""
        if not self.created_analysis_id:
            self.log_test("Get Single Analysis", False, "No analysis ID available (create analysis test failed)")
            return False
        
        try:
            response = self.session.get(f"{self.base_url}/analysis/{self.created_analysis_id}")
            
            if response.status_code == 200:
                data = response.json()
                
                # Validate response structure
                required_fields = ["id", "patient_name", "overall_score", "band", "results"]
                missing_fields = [field for field in required_fields if field not in data]
                
                if missing_fields:
                    self.log_test("Get Single Analysis", False, f"Missing fields: {missing_fields}")
                    return False
                
                # Validate ID matches
                if data["id"] != self.created_analysis_id:
                    self.log_test("Get Single Analysis", False, "Analysis ID mismatch")
                    return False
                
                self.log_test("Get Single Analysis", True, 
                            f"Retrieved analysis successfully. Patient: {data['patient_name']}")
                return True
                
            elif response.status_code == 404:
                self.log_test("Get Single Analysis", False, "Analysis not found (404)")
                return False
            else:
                self.log_test("Get Single Analysis", False, f"HTTP {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Get Single Analysis", False, f"Request error: {str(e)}")
            return False
    
    def test_invalid_analysis_id(self):
        """Test GET /api/analysis/{invalid_id} - Should return 404"""
        invalid_id = "invalid-analysis-id-12345"
        
        try:
            response = self.session.get(f"{self.base_url}/analysis/{invalid_id}")
            
            if response.status_code == 404:
                self.log_test("Invalid Analysis ID", True, "Correctly returned 404 for invalid ID")
                return True
            else:
                self.log_test("Invalid Analysis ID", False, 
                            f"Expected 404, got {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Invalid Analysis ID", False, f"Request error: {str(e)}")
            return False
    
    def run_all_tests(self):
        """Run all test scenarios"""
        print(f"🧪 Starting RezzoniX Analyzer Backend Tests")
        print(f"🔗 Backend URL: {self.base_url}")
        print("=" * 60)
        
        # Run tests in sequence
        tests = [
            self.test_health_check,
            self.test_create_analysis,
            self.test_get_all_analyses,
            self.test_get_single_analysis,
            self.test_invalid_analysis_id
        ]
        
        passed = 0
        total = len(tests)
        
        for test in tests:
            if test():
                passed += 1
            print()  # Add spacing between tests
        
        # Summary
        print("=" * 60)
        print(f"📊 Test Results: {passed}/{total} tests passed")
        
        if passed == total:
            print("🎉 All tests passed! Backend API is working correctly.")
            return True
        else:
            print(f"⚠️  {total - passed} test(s) failed. Check the details above.")
            return False

def main():
    """Main test execution"""
    tester = RezzoniXTester()
    success = tester.run_all_tests()
    
    # Save detailed results
    with open('/app/test_results_detailed.json', 'w') as f:
        json.dump(tester.test_results, f, indent=2)
    
    print(f"\n📄 Detailed results saved to: /app/test_results_detailed.json")
    
    # Exit with appropriate code
    sys.exit(0 if success else 1)

if __name__ == "__main__":
    main()