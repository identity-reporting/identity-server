## Identity Server

Identity Server helps you visualise function executions, visualise and manage executed unit tests for your app. It has a modern and feature rich user interface to help you get manage unit tests in matter of minutes. No more hours of writing unit tests.

**Note:** Identity Server will connects with the tracing agent to execute functions, manage and run unit tests in your app.  So you need to install the appropriate tracing agent for your app as well, along with Identity Server.

### Installation
It is recommended to install Identity Server globally.
```
npm install -g identity-server
```

### Run Identity Server

From the root of your `python` app, run the command to start the Identity Server:

```
identity-server
```

### Tracing agent

You need to install the appropriate tracing agent for your app. Identity Server connects 
with the tracing agent to execute functions, manage and run unit tests in your app.  

Read the documentation below to install tracing agent for your programming language.
**Python:** [identity-trace-python-agent](https://github.com/identity-reporting/identity-trace-python-agent)

