import { Logger } from '@nestjs/common';

export default function LogMethod(logger: Logger) {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;
    descriptor.value = async function (...args: any[]) {
      const logMessage = `Method ${propertyKey} called at ${new Intl.DateTimeFormat(
        'pt-BR',
        {
          year: 'numeric',
          month: 'numeric',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          second: 'numeric',
          timeZone: 'America/Sao_Paulo',
        },
      ).format(new Date())}`;
      logger.verbose(logMessage);
      // const result = await originalMethod.apply(this, args);
      try {
        const result = await originalMethod.apply(this, args);
        return result;
      } catch (error) {
        logger.error(`${logMessage} - Error`);
        throw error;
      }
    };
    return descriptor;
  };
}
