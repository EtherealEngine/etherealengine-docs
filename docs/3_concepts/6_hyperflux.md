# Networking & Data Control with Hyperflux

## Networks

Networks are a way of sharing topic specific data between certain peers. There are two types of networks, **world** and **media** networks, and are tied to location instances and media instances respectively.

## Users & Peers

Users are unique accounts created in a particular Ethereal Engine deployment. Users can connect to multiple instances, and have multiple peers connected to each instance.

## Actions

Actions are a way to control state changes in your application. Once defined, they can be dispatched, which will then populate the outgoing queue to be processed on the next frame.

All actions are dispatched to a topic, by default this is the **default** topic. Topics are used to specify that actions are to be routed to specific networks.

When an action is dispatched, it is added to the incoming action queue. If it's topic is networked, it is also added to the outgoing queue for it's topic.

At the end of the animation frame, any actions in a network topic's outgoing queue are sent to that topic's network.

If the peer is the host of a networked action's topic, the action is sent to all other peers, otherwise it is just sent to the host. This can be opted out of by specifying the $to property on an action, which informs the host to forward the action only to that user's.

At the start of the next animation frame, action queues are populated with incoming actions. These actions are then processed in the order they were received, by systems in the order the systems are registered.

![](./images/action-flow.png)

## Ownership and Authority

Ownership specifies that a networked entity belongs to a particular user. Ownership cannot be transferred for an entity, the entity must be destroyed and recreated by a new user. 

Authority specifies that a networked entity can be controlled by a particular peer. Authority can be transferred between peers, and is done so by sending an authority request action to the owner peer, upon which the owner peer will send an authority transfer action to the requesting peer.