#!/bin/bash

case "$(uname -s)" in

   Darwin)
      javac --release 11 -cp lib/*:. com/capacitorjs/gradle/Parse.java
      jar cmvf META-INF/MANIFEST.MF capacitor-gradle-parse.jar com/capacitorjs/gradle/*.class
     ;;

   Linux)
      javac --release 11 -cp lib/*:. com/capacitorjs/gradle/Parse.java
      jar cmvf META-INF/MANIFEST.MF capacitor-gradle-parse.jar com/capacitorjs/gradle/*.class
     ;;

   CYGWIN*|MINGW32*|MSYS*|MINGW*)
      echo "Windows"
      javac --release 11 -cp "lib/groovy-3.0.9.jar;lib/json-20210307.jar;." com\\capacitorjs\\gradle\\Parse.java
      jar cmvf META-INF/MANIFEST.MF capacitor-gradle-parse.jar com/capacitorjs/gradle/*.class
     ;;

   # Add here more strings to compare
   # See correspondence table at the bottom of this answer

   *)
     echo 'Other OS' 
     ;;
esac
