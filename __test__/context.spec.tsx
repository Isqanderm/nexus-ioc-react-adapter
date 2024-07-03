import { render, screen } from "@testing-library/react";
import { Injectable, Module, type NexusApplicationInterface } from "nexus-ioc";
import { NexusApplicationsServer } from "nexus-ioc/dist/server";
import type React from "react";
import { NexusProvider, useNexus } from "../src";

@Injectable()
class AppService {
	public getHello() {
		return "Hello World";
	}
}

@Module({
	providers: [AppService],
})
class AppModule {}

const MockComponent: React.FC = () => {
	const service = useNexus<AppService>(AppService);

	if (!service) {
		return <div>Loading...</div>;
	}

	return <div>{service.getHello()}</div>;
};

describe("Nexus-IoC provider", () => {
	let app: NexusApplicationInterface;
	beforeEach(async () => {
		app = await NexusApplicationsServer.create(AppModule).bootstrap();
	});

	describe("NexusIoCProvider", () => {
		it("provides dependencies to child components", async () => {
			render(
				<NexusProvider container={app}>
					<MockComponent />
				</NexusProvider>,
			);

			expect(await screen.findByText("Hello World")).toBeDefined();
		});

		it("throws an error when used outside of NexusIoCProvider", () => {
			const renderWithoutProvider = () => render(<MockComponent />);

			expect(renderWithoutProvider).toThrow(
				"useNexus must be used within an NexusIoCProvider",
			);
		});
	});
});
