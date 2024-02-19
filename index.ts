// Import stylesheets
import { Inject, Injectable } from './my-di';
import './style.css';

@Injectable()
class ServiceA {
  constructor() {}

  doSomething() {
    console.log('ServiceA is doing something.');
  }
}

@Injectable()
class ServiceB {
  constructor(private serviceA: ServiceA) {}

  doSomething() {
    console.log('ServiceB is doing something.');
    this.serviceA.doSomething();
  }
}

@Injectable()
class ServiceC {
  constructor(private serviceA: ServiceA, private serviceB: ServiceB) {}

  doSomething() {
    this.serviceA.doSomething();
    console.log('ServiceC is doing something.');
    this.serviceB.doSomething();
  }
}

const serviceC = Inject<ServiceC>('ServiceC');
serviceC.doSomething();

// OUTPUT:
// ServiceA is doing something
// ServiceC is doing something
// ServiceB is doing something
// ServiceA is doing something
