import os

# Define the project structure
structure = {
    "bms-backend": {
        "controllers": [
            "authController.js",
            "customerController.js",
            "productController.js",
            "reportController.js",
            "transactionController.js",
        ],
        "middleware": ["authMiddleware.js"],
        "models": ["Customer.js", "Product.js", "Transaction.js", "User.js"],
        "routes": ["auth.js", "customers.js", "products.js", "reports.js", "transactions.js"],
        "files": [".env", "package.json", "server.js"],
    },
    "bms-frontend": {
        "api": ["apiClient.js"],
        "context": ["AuthContext.js"],
        "navigation": ["AppStack.js", "AuthStack.js", "RootNavigator.js"],
        "screens": [
            "CreateSaleScreen.js",
            "CustomerFormScreen.js",
            "CustomerListScreen.js",
            "DashboardScreen.js",
            "LoginScreen.js",
            "MyAccountScreen.js",
            "ProductFormScreen.js",
            "ProductListScreen.js",
            "RegisterScreen.js",
            "ReportsScreen.js",
            "SalesHistoryScreen.js",
        ],
        "files": ["App.js", "eas.json", "package.json"],
    },
}


def create_structure(base_path, structure):
    for folder, contents in structure.items():
        folder_path = os.path.join(base_path, folder)
        os.makedirs(folder_path, exist_ok=True)

        for subfolder, files in contents.items():
            if subfolder == "files":
                for file in files:
                    file_path = os.path.join(folder_path, file)
                    open(file_path, "a").close()
            else:
                subfolder_path = os.path.join(folder_path, subfolder)
                os.makedirs(subfolder_path, exist_ok=True)
                for file in files:
                    file_path = os.path.join(subfolder_path, file)
                    open(file_path, "a").close()


if __name__ == "__main__":
    base_directory = "."  # Current directory
    create_structure(base_directory, structure)
    print("✅ bms-backend & bms-frontend structure created successfully!")
