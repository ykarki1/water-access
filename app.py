# Well Hellllloooooo THERE!!

from flask import Flask, render_template, request, Response, redirect


app = Flask(__name__)

@app.route('/')
def index():
    return render_template ('index.html')
    


if __name__ == "__main__":
    app.run(port=5000)