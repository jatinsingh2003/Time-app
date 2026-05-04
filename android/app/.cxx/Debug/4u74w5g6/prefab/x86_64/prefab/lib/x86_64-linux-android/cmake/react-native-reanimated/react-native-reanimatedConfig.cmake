if(NOT TARGET react-native-reanimated::reanimated)
add_library(react-native-reanimated::reanimated SHARED IMPORTED)
set_target_properties(react-native-reanimated::reanimated PROPERTIES
    IMPORTED_LOCATION "D:/intern/Time-app/node_modules/react-native-reanimated/android/build/intermediates/cxx/Debug/2g495443/obj/x86_64/libreanimated.so"
    INTERFACE_INCLUDE_DIRECTORIES "D:/intern/Time-app/node_modules/react-native-reanimated/android/build/prefab-headers/reanimated"
    INTERFACE_LINK_LIBRARIES ""
)
endif()

