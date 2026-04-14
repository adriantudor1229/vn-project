package com.example.vnbe.entity.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum Language {

    AR("ar"),
    BE("be"),
    BG("bg"),
    BS("bs"),
    CA("ca"),
    CS("cs"),
    CK("ck"),
    DA("da"),
    DE("de"),
    EL("el"),
    EN("en"),
    EO("eo"),
    ES("es"),
    ET("et"),
    EU("eu"),
    FA("fa"),
    FI("fi"),
    FR("fr"),
    GA("ga"),
    GL("gl"),
    GD("gd"),
    HE("he"),
    HI("hi"),
    HR("hr"),
    HU("hu"),
    ID("id"),
    IT("it"),
    IU("iu"),
    JA("ja"),
    KK("kk"),
    KO("ko"),
    MK("mk"),
    MS("ms"),
    NE("ne"),
    LA("la"),
    LT("lt"),
    LV("lv"),
    NL("nl"),
    NO("no"),
    PL("pl"),
    PT_PT("pt-pt"),
    PT_BR("pt-br"),
    RO("ro"),
    RU("ru"),
    SK("sk"),
    SL("sl"),
    SR("sr"),
    SV("sv"),
    TA("ta"),
    TH("th"),
    TR("tr"),
    UK("uk"),
    UR("ur"),
    VI("vi"),
    ZH("zh"),
    ZH_HANS("zh-Hans"),
    ZH_HANT("zh-Hant");

    private final String code;
}
