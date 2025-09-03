from flask import Flask
app = Flask(__name__)

@app.route('/api/python/hello', methods=['GET'])
def handler():
   message = "Hello, World!"
   return jsonify({"message": message})

if __name__ == '__main__':
    app.run(port=5328)