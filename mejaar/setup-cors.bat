@echo off
echo Setting up Firebase Storage CORS configuration...
echo.
echo This will allow your local development server to access Firebase Storage files.
echo.
echo Installing Google Cloud SDK (if not already installed)...
echo Download from: https://cloud.google.com/sdk/docs/install
echo.
echo After installing gcloud, run this command:
echo.
echo gsutil cors set cors.json gs://mejaar-app.firebasestorage.app
echo.
echo Alternative: Use Firebase Storage Rules to allow cross-origin requests
echo.
pause
