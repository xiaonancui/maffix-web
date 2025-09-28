"use client";

import { Refine } from "@refinedev/core";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import { useNotificationProvider } from "@refinedev/antd";
import routerProvider from "@refinedev/nextjs-router";
import { ConfigProvider, App } from "antd";
import { ReactNode } from "react";

import { dataProvider } from "@/lib/refine";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <RefineKbarProvider>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#1677ff",
          },
        }}
      >
        <App>
          <Refine
            routerProvider={routerProvider}
            dataProvider={dataProvider}
            notificationProvider={useNotificationProvider}
            resources={[
              {
                name: "tasks",
                list: "/dashboard",
                create: "/dashboard/tasks/create",
                edit: "/dashboard/tasks/edit/:id",
                show: "/dashboard/tasks/show/:id",
                meta: {
                  canDelete: true,
                },
              },
              {
                name: "users",
                list: "/admin",
                create: "/admin/users/create",
                edit: "/admin/users/edit/:id",
                show: "/admin/users/show/:id",
                meta: {
                  canDelete: true,
                },
              },
              {
                name: "prizes",
                list: "/dashboard/prizes",
                create: "/dashboard/prizes/create",
                edit: "/dashboard/prizes/edit/:id",
                show: "/dashboard/prizes/show/:id",
                meta: {
                  canDelete: false,
                },
              },
            ]}
            options={{
              syncWithLocation: true,
              warnWhenUnsavedChanges: true,
              projectId: "tententen-web",
            }}
          >
            {children}
            <RefineKbar />
          </Refine>
        </App>
      </ConfigProvider>
    </RefineKbarProvider>
  );
}
