package io.ionic.starter;

import com.getcapacitor.BridgeActivity;

import io.ionic.starter.sub.Helper;

public class MainActivity extends BridgeActivity {
    private final String greeting = Helper.greeting();
}
