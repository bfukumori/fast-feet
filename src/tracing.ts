import {
	Context,
	DiagConsoleLogger,
	DiagLogLevel,
	diag,
	SpanKind,
} from "@opentelemetry/api";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-grpc";
import { HttpInstrumentation } from "@opentelemetry/instrumentation-http";
import { NodeSDK } from "@opentelemetry/sdk-node";
import {
	ReadableSpan,
	SimpleSpanProcessor,
	Span,
	SpanProcessor,
} from "@opentelemetry/sdk-trace-node";
import { PrismaInstrumentation } from "@prisma/instrumentation";

diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.ERROR);

class FilteringSpanProcessor implements SpanProcessor {
	constructor(private delegate: SpanProcessor) {}

	onStart(span: Span, parentContext: Context): void {
		this.delegate.onStart(span, parentContext);
	}

	onEnd(span: ReadableSpan) {
		if (span.kind === SpanKind.INTERNAL) {
			return;
		}
		this.delegate.onEnd(span);
	}

	shutdown() {
		return this.delegate.shutdown();
	}

	forceFlush() {
		return this.delegate.forceFlush();
	}
}

const exporter = new OTLPTraceExporter({
	url: "http://localhost:4317",
});

const sdk = new NodeSDK({
	serviceName: "fast-fleet-api",
	instrumentations: [new HttpInstrumentation(), new PrismaInstrumentation()],
	spanProcessors: [
		new FilteringSpanProcessor(new SimpleSpanProcessor(exporter)),
	],
});

process.on("SIGTERM", async () => {
	try {
		await sdk.shutdown();
		console.log("Tracing shut down successfully");
	} catch (err) {
		console.error("Error shutting down tracing", err);
	} finally {
		process.exit(0);
	}
});

export const initializeTracing = async () => {
	return sdk.start();
};
