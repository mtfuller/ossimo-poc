# The Ossimo Project
The Ossimo Project initiative sets out to design and implement a platform that encourages codebases that are easy to understand, deploy, and change.


## Overview
This whitepaper attempts to present several problems and issues that are typical for large, complex enterprise software systems.


## Problems
Many of the tools and products we use everyday are powered by large, complex enterprise software systems. Netflix, Amazon, and FaceBook name a few. These products can run accross thousands of servers. The architecture of these systems can range from microservice-based to monolithic. Below are a few common problems of large enterprise systems.

### Change-Resistant Systems
As systems grow in complexity, it can often lead to systems that have nodes (OOP classes, microservices, etc.) that are dependent on many other nodes. These interdependent nodes create a phenomenon where a change in architecture would be too costly. Thus, many business choose to save resources and keep the change resistant systems, until it becomes more cost-effective to replace the legacy system.

### Deployment Lock-In
Generally speaking, when a business designs an architecture for a software system, they unknowingly lock themselves into how they will deploy. For example, if a business decides to design their system using a microservice architecture, they have decided that each service must run separately in its own process. 

Moving a monolithic system to a microservice-based system, is an extremely costly endeavor. The inverse is also true. This phenomenon keeps business locked into the architecture they chose in the beginning, with not much hope of escaping as the system grows.


## What is Ossimo?
TBAL

### Complexity Managment
TBAL

### Separation of Development and Deployment
TBAL


## Ossimo Concepts
The Ossimo platform utilizes some unique terminalology when defining a system topology.

### Components
Components are the most basic building block of a system. All they do is simply provide an interface to other components to interact with it.

There are two major types of components:
 - Modules - provide implementation for its interface
 - Controllers - delegate implementation for its interface to its subcomponents

```
            ┌─────────────┐           ┌─────────────┐  
            │ ControllerA │ <-------> │ ControllerB │
            └─────────────┘           └─────────────┘
            /             \                  |
┌──────────────┐       ┌──────────┐    ┌──────────┐
│ ControllerA1 │ <---> │ ModuleA2 │    │ ModuleA2 │
└──────────────┘       └──────────┘    └──────────┘
       |
 ┌───────────┐
 │ ModuleA11 │
 └───────────┘
```

This paper will now go into detail for each of these.

### Modules
A Module is a type of component that implements its interface in some language or platform

Here is a simple example of an Ossimo Module. It's simply a folder that contains the `ossimo.yml` file and a `/src` folder with the implementing code.
```
 └ ExampleModule/
   ├ src/
   │ └ ExampleModule.py
   └ ossimo.yml
```
The `ossimo.yml` simply defines that the component is a module, defines its interface, and defines information on where the interface is defined:
```yaml
# ossimo.yml

ExampleModule:
    type: module
    
    interface:
        add(int a, int b): int
        mul(int a, int b): int
    
    implementation:
        platform: python3
        file: ./src/ExampleModule.py
```
The `ossimo.yml` declares that the interface is defined in `./src/ExampleModule.py`. 

The `ExampleModule.py` must include corresponding functions to what is defined in the interface.
```python
# ExampleModule.py

def add(a, b):
    return a + b

def mul(a, b):
    return a * b
```
### Controllers
An Ossimo Controller is a type of component that simply delegates the implementation of its interface to its subcomponents.

For example, an example of a simply Controller would be defined by the following directory structure:
```
 └ ExampleController/
   ├ components/
   │ └ ExampleModule/
   │   └ ...
   └ ossimo.yml
```
Note, there are now implementation files for controllers. They can only delegate implementation to their subcomponents. 

So, an example `ossimo.yml` file of a controller would look like this:
```yaml
# ossimo.yml

ExampleController:
    type: controller
    
    interface:
        addsNumbers(int i, int j): int
    
    delegation:
        addsNumbers(i, j): ExampleModule.add(i, j)
```
As one can see, it maps the `addsNumbers` interface to its `ExampleModule` subcomponent.


## Component Communication
```
┌───────┐     
│ hello │ => ( data )
└───────┘
```