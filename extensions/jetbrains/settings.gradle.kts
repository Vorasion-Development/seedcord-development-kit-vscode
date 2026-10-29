import org.jetbrains.intellij.platform.gradle.extensions.intellijPlatform

rootProject.name = "jetbrains_development_kit"

pluginManagement {
    val detektVersion = providers.gradleProperty("DETEKT_VERSION").get()

    plugins {
        id("dev.detekt") version detektVersion
        id("org.jetbrains.kotlin.jvm") version "2.3.21"
        id("org.jetbrains.changelog") version "2.5.0"
    }

    repositories {
        gradlePluginPortal()
        mavenCentral()
    }
}

plugins {
    id("org.gradle.toolchains.foojay-resolver-convention") version "1.0.0"
    id("org.jetbrains.intellij.platform.settings") version "2.19.0"
}

dependencyResolutionManagement {
    // Configure all projects' repositories
    repositories {
        mavenCentral()

        // IntelliJ Platform Gradle Plugin Repositories Extension - read more: https://plugins.jetbrains.com/docs/intellij/tools-intellij-platform-gradle-plugin-repositories-extension.html
        intellijPlatform {
            defaultRepositories()
        }
    }
}
