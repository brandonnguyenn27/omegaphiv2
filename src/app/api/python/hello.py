import json

def handler(request, context):
    """Vercel serverless function handler"""
    return {
        "statusCode": 200,
        "headers": {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
        },
        "body": json.dumps({
            "message": "Hello World from Python Backend!"
        })
    }
