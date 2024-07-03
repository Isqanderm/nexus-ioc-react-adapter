import type { InjectionToken, NexusApplicationInterface } from "nexus-ioc";
import type React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { createContext, useContext, useMemo } from "react";

interface NexusContextInterface {
	get<T>(T: InjectionToken): Promise<T | undefined>;
}

const NexusContext = createContext<NexusContextInterface | null>(null);

export const NexusProvider: React.FC<{
	container: NexusApplicationInterface;
	children: React.ReactNode;
}> = ({ container, children }) => {
	return (
		<NexusContext.Provider value={container}>{children}</NexusContext.Provider>
	);
};

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function useNexus<T = any>(token: InjectionToken): T | undefined {
	const context = useContext(NexusContext);
	const [state, setState] = useState<T | undefined>(undefined);

	if (!context) {
		throw new Error("useNexus must be used within an NexusIoCProvider");
	}

	useEffect(() => {
		if (token === undefined) {
			return;
		}

		async function bootstrap() {
			const service = await context?.get<T>(token);

			setState(service);
		}

		bootstrap();
	}, [context, token]);

	return state;
}
