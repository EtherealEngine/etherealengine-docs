<!-- TODO: De-duplicate the sections -->
# 3.1 Code Overview:

## Node Types

- Events: for implementing arbitrary events that start execution: Start, Tick
- Actions: for implementing actions that trigger animations, scene scene variations, or update internal state: Log, Play Gltf animation, Play Audio, Play Video, etc
- Logic: for arithmetic, trigonometry as well as vector operations and string manipulation: Add, Subtract, Multiply, Divide, Pow, Exp, Log, Log2, Log10, Min, Max, Round, Ceil, Floor, Sign, Abs, Trunc, Sqrt, Negate, A# Introduction

## 3.2 Key Concepts

- Nodes 
- Connections 
- Flow 
- Events
- Set and Get Scene Properties
- Registering nodes
- Value Types
- Value type Converters

## 3.3 Engine Nodes

### 3.3.1 Entity

- Teleport Entity
- Add Entity
- Delete Entity
- Get Entity from Scene
- Get Camera Entity

### 3.3.2 Component

- Add Component
- Delete Component
- Get component from registry
- Get component from entity

### 3.3.3 Engine

- Play Video
- Play Audio
- Play Gltf Animations
- Get Avatar animations
- Fade Camera
- Switch Scene

### 3.3.4 Events

Either in pairs of trigger and listener , or just listener

- On Button State
- triggerLoadAsset -> onLoadAsset
- OnQuery

