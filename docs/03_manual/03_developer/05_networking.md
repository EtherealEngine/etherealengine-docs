# Networking

## Networks
Networks are a way of sharing topic specific data between certain peers.  
There are two types of networks:
- **world** networks -> tied to location instances
- **media** networks -> tied to media instances

## Users & Peers
Users are unique accounts created in a particular Ethereal Engine deployment.  
Users can connect to multiple instances, and have multiple peers connected to each instance.  
Only a single avatar will be loaded for a user, but this avatar can be controlled by any of that user's peers.

## Ownership and Authority
Ownership specifies that a networked entity belongs to a particular user.  
Ownership cannot be transferred for an entity. The entity must be destroyed and recreated by a new user. 

Authority specifies that a networked entity can be controlled by a particular peer.  
Authority can be transferred between peers, and is done so by sending an authority request action to the owner peer, upon which the owner peer will send an authority transfer action back to the requesting peer.
