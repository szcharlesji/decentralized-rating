'use client';

import { useQuery } from '@tanstack/react-query';
import { useSuiClient } from '@mysten/dapp-kit';

export interface PackageMetadata {
  packageId: string;
  name?: string;
  version?: string;
  modules?: string[];
  hasMetadata: boolean;
}

export function usePackageMetadata(packageId: string | undefined) {
  const client = useSuiClient();

  return useQuery({
    queryKey: ['package-metadata', packageId],
    queryFn: async (): Promise<PackageMetadata | null> => {
      if (!packageId) return null;

      try {
        // Fetch package data from Sui
        const packageData = await client.getObject({
          id: packageId,
          options: {
            showContent: true,
            showType: true,
            showPreviousTransaction: true,
          },
        });

        if (packageData.data) {
          // Try to get module names from the package
          const modules = await client.getNormalizedMoveModulesByPackage({
            package: packageId,
          });

          const moduleNames = Object.keys(modules);

          return {
            packageId,
            name: moduleNames[0] || 'Unknown Package',
            version: '1.0.0', // Version info not directly available
            modules: moduleNames,
            hasMetadata: true,
          };
        }
      } catch (error) {
        console.error('Error fetching package metadata:', error);
      }

      return {
        packageId,
        hasMetadata: false,
      };
    },
    enabled: !!packageId,
    staleTime: 60000, // Cache for 1 minute
  });
}
