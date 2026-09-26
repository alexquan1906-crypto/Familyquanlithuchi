package com.familyfinance.app;

import android.os.Bundle;
import android.webkit.WebSettings;
import android.webkit.WebView;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        configureWebView();
    }

    @Override
    public void onResume() {
        super.onResume();
        configureWebView();
    }

    private void configureWebView() {
        if (bridge != null && bridge.getWebView() != null) {
            WebView webView = bridge.getWebView();
            WebSettings settings = webView.getSettings();

            // Khóa tỷ lệ TextZoom 100% để giao diện không bị phóng to/thu nhỏ theo font chữ hệ thống điện thoại
            settings.setTextZoom(100);

            // Tắt pinch-to-zoom thủ công để giữ chuẩn tỉ lệ ứng dụng di động native
            settings.setSupportZoom(false);
            settings.setBuiltInZoomControls(false);
            settings.setDisplayZoomControls(false);

            // Cấu hình viewport chuẩn tỉ lệ màn hình
            settings.setUseWideViewPort(true);
            settings.setLoadWithOverviewMode(true);
        }
    }
}
