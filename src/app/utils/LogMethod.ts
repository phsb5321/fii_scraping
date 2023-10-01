import { Logger } from '@nestjs/common';

type AsyncMethod<T extends any[]> = (...args: T) => Promise<unknown>;

export default function LogMethod(logger: Logger): MethodDecorator {
  return (
    target: Record<string, unknown>, // Using unknown instead of any
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ): PropertyDescriptor => {
    const originalMethod = descriptor.value as AsyncMethod<any[]>;
    if (!originalMethod) throw new Error('Descriptor value must be defined');

    descriptor.value = async function (...args: unknown[]): Promise<unknown> {
      const methodName = String(propertyKey);
      const logMessage = buildLogMessage(methodName);

      logger.verbose(logMessage);

      try {
        return await originalMethod.apply(this, args);
      } catch (error) {
        logger.error(`${logMessage} - Error`);
        throw error;
      }
    };

    return descriptor;
  };
}

function buildLogMessage(methodName: string): string {
  const currentDate = new Date();
  const formattedDate = new Intl.DateTimeFormat('pt-BR', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    timeZone: 'America/Sao_Paulo',
  }).format(currentDate);

  return `Method ${methodName} called at ${formattedDate}`;
}
