from flask import Flask, render_template
import pandas as pd

app = Flask(__name__)

@app.route('/')
def dashboard():
    df = pd.read_csv("raw_data.csv")
    unique_topics = df['topic'].unique()
    return render_template('dashboard.html', topics=unique_topics)

if __name__ == '__main__':
    app.run(debug=True)