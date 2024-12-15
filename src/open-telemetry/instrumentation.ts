/*instrumentation.ts*/
import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import {
  PeriodicExportingMetricReader,
} from '@opentelemetry/sdk-metrics';
import {
  ATTR_SERVICE_NAME,
  ATTR_SERVICE_VERSION,
} from '@opentelemetry/semantic-conventions';
import { Resource } from '@opentelemetry/resources';
import { diag, DiagConsoleLogger, DiagLogLevel } from '@opentelemetry/api';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-http';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';

const buildResource = (
  serviceName: string,
  serviceVersion: string,
): Resource => {
  return new Resource({
    [ATTR_SERVICE_NAME]: serviceName,
    [ATTR_SERVICE_VERSION]: serviceVersion,
  });
};

const buildTraceExporter = () => {
  return new OTLPTraceExporter({
    url: 'http://0.0.0.0:4318/v1/traces',
    headers: { 'Content-Type': 'application/json' },
  });
};

const buildMetricReader = (): PeriodicExportingMetricReader => {
  return new PeriodicExportingMetricReader({
    exporter: new OTLPMetricExporter({
      url: 'http://0.0.0.0:4318/v1/metrics',
      headers: { 'Content-Type': 'application/json' },
    }),
  });
};

export const initOpenTelemetry = () => {
  // For troubleshooting, set the log level to DiagLogLevel.DEBUG
  diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.DEBUG);

  const sdk = new NodeSDK({
    resource: buildResource('opentelemetry-one', '1.0.0'),
    traceExporter: buildTraceExporter(),
    metricReader: buildMetricReader(),
    instrumentations: [getNodeAutoInstrumentations()],
  });

  sdk.start();
  console.log('OpenTelemetry initialized');
};
