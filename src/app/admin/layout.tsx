"use client";

import React, { ReactNode, useEffect, Suspense } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { getAuthCredentials, isAuthenticated } from "@utils/auth-utils";
import { ROUTES } from "@utils/routes";
import { createTheme } from "@mui/material/styles";
import { AppProvider, type Session, type Router as ToolpadRouter } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { DemoProvider } from "@toolpad/core/internal";        
import { useModulesQuery } from "@/data/module/use-module.query";   
import { transformNavigation } from "@/utils/transformNavigation";

interface DashboardLayoutProps {
  children: ReactNode;
}

const adminTheme = createTheme({
  cssVariables: { colorSchemeSelector: "data-toolpad-color-scheme" },
  colorSchemes: { light: true, dark: true },
  breakpoints: { values: { xs: 0, sm: 600, md: 600, lg: 1200, xl: 1536 } },
});

function DashboardOnlyLayoutInner({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const authCredentials = getAuthCredentials();

  useEffect(() => {
    if (!isAuthenticated(authCredentials)) {
      router.replace(ROUTES.LOGIN);
    }
  }, [router, authCredentials]);

  const { data: modules } = useModulesQuery({
    where: { parentId: 0 },
    order: ["ordering ASC"],
    include: [
      { relation: "children", scope: { order: ["ordering ASC"] } },
    ],
  });
 
  console.log('modules ',modules );
  //const navigation = transformNavigation(modules || []);
  //console.log('navigation ',navigation );

  const toolpadRouter: ToolpadRouter = {
    pathname: pathname || "",
    searchParams: searchParams || new URLSearchParams(),
    navigate: (url: string | URL) => router.push(typeof url === "string" ? url : url.toString()),
  };

  const adminWindow = typeof window !== "undefined" ? window : undefined;

 const [session, setSession] = React.useState<Session | null>(null);

useEffect(() => {
  const auth = getAuthCredentials();
  if (!isAuthenticated(auth)) {
    router.replace(ROUTES.LOGIN);
  } else {
    setSession({
      user: {
        name: auth?.firstName,
        email: auth?.email,
        image: "/icon.png",
      },
    });
  }
}, [router]);

  const authentication = React.useMemo(
    () => ({
      signIn: () => {
        setSession({
          user: {
            name: authCredentials?.firstName,
            email: authCredentials?.email,
            image: "/icon.png",
          },
        });
      },
      signOut: () => router.replace(ROUTES.LOGOUT),
    }),
    [router, authCredentials]
  );

  return (
    <DemoProvider window={adminWindow}>
      <AppProvider
      //navigation={navigation}
        branding={{
          logo: <img src="/logo-new.png" alt="Custom CMS Logo" />,
          title: "",
          homeUrl: "/admin/dashboard",
        }}
        session={session}
        authentication={authentication}
        router={toolpadRouter}
        theme={adminTheme}
        window={adminWindow}
      >
        <DashboardLayout>{children}</DashboardLayout>
      </AppProvider>
    </DemoProvider>
  );
}

// ✅ Wrap with Suspense
export default function DashboardOnlyLayout({ children }: DashboardLayoutProps) {
  return (
    <Suspense fallback={<div>Loading dashboard...</div>}>
      <DashboardOnlyLayoutInner>{children}</DashboardOnlyLayoutInner>
    </Suspense>
  );
}
