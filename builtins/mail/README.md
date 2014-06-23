hideout mail template
=====================

## Tasks

### grunt

Run server on a free port serving the `rendered` dir.
Keeps it alive with a watch task monitoring file changes.

### grunt create:<new mail template name>

creates a new mail template in the `template/mails` dir with the given name.

    grunt create:hello
    Created template/mails/hello.dust

or

    grunt create:"hey ho let's go"
    Created template/mails/hey ho let's go.dust