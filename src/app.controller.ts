import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { trace, metrics } from '@opentelemetry/api';
import { Span } from '@opentelemetry/sdk-trace-node';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    const tracer = trace.getTracer('app-controller-tracer');
    const meter = metrics.getMeter('app-controller-meter', '1.0.0');
    const helloCounter = meter.createCounter('hello_counter', {
      description: 'A counter for hello route hits',
    });
    
    
    return tracer.startActiveSpan(this.getHello.name, (span: Span) => {
      const response = this.appService.getHello();
      helloCounter.add(1, { route: '/' });
      span.end();
      return response;
    });    
  }
}
