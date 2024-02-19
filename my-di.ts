import 'reflect-metadata';

export function Injectable() {
  return (target: any) => {
    const container = Container.getInstance();
    container.register(target.name, target);
  };
}

class Container {
  private static instance: Container;
  private instances: { [key: string]: any } = {};
  private resolving: { [key: string]: boolean } = {};
  private resolvedIstances: { [key: string]: any } = {};

  private constructor() {}

  static getInstance(): Container {
    if (!Container.instance) {
      Container.instance = new Container();
    }
    return Container.instance;
  }

  register(key: string, target: any) {
    this.instances[key] = target;
  }

  // Risolve una dipendenza e restituisce un'istanza singleton
  resolve<T>(key: string): T {
    if (!this.instances[key]) {
      throw new Error(`Classe ${key} Class not registered in container.`);
    }

    // Verifica se l'istanza è già stata risolta
    if (!(this.instances[key] instanceof Function)) {
      return this.instances[key];
    }

    // Verifica e gestisce le dipendenze cicliche
    if (this.resolving[key]) {
      throw new Error(`Dipendenza ciclica rilevata per la classe ${key}.`);
    }

    // Inizia la risoluzione dell'istanza
    this.resolving[key] = true;

    // Risolvi le dipendenze e crea l'istanza
    const dependencies = this.getDependencies(this.instances[key]);
    const resolvedDependencies = dependencies.map((dep: string) =>
      this.resolve(dep)
    );

    this.resolvedIstances[key] = new this.instances[key](
      ...resolvedDependencies
    );
    // Fine della risoluzione
    this.resolving[key] = false;

    return this.resolvedIstances[key];
  }

  // Ottiene le dipendenze di una classe
  private getDependencies(target: any): string[] {
    const paramTypes = Reflect.getMetadata('design:paramtypes', target) || [];
    const dependencies: string[] = [];
    for (const paramType of paramTypes) {
      if (paramType.name === 'Object') {
        throw new Error(
          'Impossibile risolvere la dipendenza. Assicurati che le classi siano registrate nel container.'
        );
      }
      dependencies.push(paramType.name);
    }
    return dependencies;
  }
}

export function Inject<T>(key: string) {
  return Container.getInstance().resolve<T>(key);
}
