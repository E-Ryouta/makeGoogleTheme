import { useEffect, useMemo, useRef } from "react";
import { useTheme } from "../store/themeStore";

export function useThemeImages() {
  const { state } = useTheme();

  const frameBgUrl = useMemo(() => {
    const f = state.images.theme_frame;
    if (!f) return undefined;
    return URL.createObjectURL(f.blob);
  }, [state.images.theme_frame]);

  const toolbarBgUrl = useMemo(() => {
    const f = state.images.theme_toolbar;
    if (!f) return undefined;
    return URL.createObjectURL(f.blob);
  }, [state.images.theme_toolbar]);

  const tabBgUrl = useMemo(() => {
    const f = (state.images as any).theme_tab_background as
      | { blob: Blob }
      | undefined;
    if (!f) return undefined;
    return URL.createObjectURL(f.blob);
  }, [state.images]);

  const ntpBgUrl = useMemo(() => {
    const f = state.images.theme_ntp_background;
    if (!f) return undefined;
    return URL.createObjectURL(f.blob);
  }, [state.images.theme_ntp_background]);

  // URL cleanup management
  const prevUrl = useRef<{
    frame?: string;
    toolbar?: string;
    tab?: string;
    ntp?: string;
  }>({});

  useEffect(() => {
    if (prevUrl.current.ntp && prevUrl.current.ntp !== ntpBgUrl)
      URL.revokeObjectURL(prevUrl.current.ntp);
    prevUrl.current.ntp = ntpBgUrl;
    return () => {
      if (prevUrl.current.ntp) URL.revokeObjectURL(prevUrl.current.ntp);
    };
  }, [ntpBgUrl]);

  useEffect(() => {
    if (prevUrl.current.frame && prevUrl.current.frame !== frameBgUrl)
      URL.revokeObjectURL(prevUrl.current.frame);
    prevUrl.current.frame = frameBgUrl;
    return () => {
      if (prevUrl.current.frame) URL.revokeObjectURL(prevUrl.current.frame);
    };
  }, [frameBgUrl]);

  useEffect(() => {
    if (prevUrl.current.toolbar && prevUrl.current.toolbar !== toolbarBgUrl)
      URL.revokeObjectURL(prevUrl.current.toolbar);
    prevUrl.current.toolbar = toolbarBgUrl;
    return () => {
      if (prevUrl.current.toolbar) URL.revokeObjectURL(prevUrl.current.toolbar);
    };
  }, [toolbarBgUrl]);

  useEffect(() => {
    if (prevUrl.current.tab && prevUrl.current.tab !== tabBgUrl)
      URL.revokeObjectURL(prevUrl.current.tab);
    prevUrl.current.tab = tabBgUrl || undefined;
    return () => {
      if (prevUrl.current.tab) URL.revokeObjectURL(prevUrl.current.tab);
    };
  }, [tabBgUrl]);

  return {
    frameBgUrl,
    toolbarBgUrl,
    tabBgUrl,
    ntpBgUrl,
  };
}
