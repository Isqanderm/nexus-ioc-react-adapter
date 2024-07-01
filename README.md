# Nexus IoC React Adapter

## Introduction

The Nexus IoC React Adapter allows you to seamlessly integrate the Nexus IoC container into your React applications. This adapter provides a context provider and a custom hook to use dependency injection within your React components.

## Installation

Install the Nexus IoC React Adapter along with the Nexus IoC container and Reflect Metadata:

```bash
npm install nexus-ioc nexus-ioc-react-adapter reflect-metadata
```

## Setup

### Step 1: Define Your Modules and Providers

First, create a module and a provider using the Nexus IoC decorators.

```typescript
import { Module, Injectable, Inject } from 'nexus-ioc';

@Injectable()
export class AppService {

  getHello(): string {
    return `Hello World!`;
  }
}

@Module({
  providers: [AppService],
})
export class AppModule {}
```

### Step 2: Setup the Nexus IoC Provider in React

Wrap your React application with the NexusIoCProvider.

```typescript jsx
import React from 'react';
import ReactDOM from 'react-dom';
import { NexusIoCProvider } from 'nexus-ioc-react-adapter';
import { NexusApplicationsBrowser } from 'nexus-ioc/dist/browser';

async function bootstrap() {
  const container = await NexusApplicationsServer.create(AppModule)
    .bootstrap();
  
  ReactDOM.render(
    <NexusIoCProvider container={container}>
      <App />
    </NexusIoCProvider>,
    document.getElementById('root'),
  );
}

bootstrap();
```

## Usage

Using the `useNexus` Hook

```typescript jsx
import React, { useEffect, useState } from 'react';
import { useNexus } from 'nexus-ioc-react-adapter';
import { AppService } from './app.service';

export const MyComponent: React.FC = () => {
  const appService = useNexus<AppService>(AppService);
  
  return <div>{appService?.getHello()}</div>;
};
```
