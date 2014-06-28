wittl
=====

Getting started on development
---------------

Run vagrant up!
```
vagrant up
```

Provisioning / Deployment
--------------

Provision a production server with
```
ansible-playbook -i <ip-address>, -v provision.yml --ask-vault-pass
```

Deploy with the following command
```
ansible-playbook -i wittl.it, -v deploy.yml
```