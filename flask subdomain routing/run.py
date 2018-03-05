from flask import Flask, redirect
''' Instructions:
        To test locally:
            Go to your /etc/hosts file (Windows and Linux locations vary)
            Add these lines:
            127.0.0.1 customdomainname
            127.0.0.1 subdomain0.customdomainname
            127.0.0.1 subdomain1.customdomainname

        For both local and non local use:
            In your Flask app file make sure you have:
            app = Flask(__name__)
            app.config['SERVER_NAME'] = "customdomainname:port"
'''
# setup Flask app
app = Flask(__name__)
app.config['SERVER_NAME'] = "customdomainname:5000"

# routing dictionary
routing = {"google": "google.com",
           "yahoo": "yahoo.com"}


@app.route("/")
def home():
    return "DEFAULT PAGE ROUTING"


@app.route('/', subdomain='<target>')
def target_subdomain(target):
    return redirect("http://" + routing[target])


# Run the program
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, threaded=True, debug=False)
