#!/bin/bash
javac -cp lib/*:. com/capacitorjs/gradle/Parse.java
jar cmvf META-INF/MANIFEST.MF capacitor-gradle-parse.jar com/capacitorjs/gradle/*.class