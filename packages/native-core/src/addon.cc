#include <napi.h>
#include <uv.h>
#include <windows.h>
#include <stdio.h>
using namespace std;
using namespace Napi;
#define VALUE_MAX 32767
#define DATA_MAX (1024 * 1024)

static WCHAR lpValueName[VALUE_MAX];
static BYTE lpData[DATA_MAX];

HKEY openKey(const Napi::CallbackInfo& info, REGSAM access) {
    HKEY res = 0;
    auto root = (HKEY)(int64_t)info[0].ToNumber();
    auto path = info[1].ToString().Utf16Value();

    LSTATUS error;
    if ((error = RegOpenKeyExW(root, (LPCWSTR)path.c_str(), 0, access, &res)) != ERROR_SUCCESS) {
        return 0;
    }
    return res;
};

Napi::Value getKey(const Napi::CallbackInfo& info) {
    auto env = info.Env();
    // printf("%ls\n", env);
    auto key = openKey(info, KEY_READ);
    if (!key) {
        return info.Env().Null();
    }
    DWORD index = 0;
    DWORD valueType;
    DWORD lpcchValueName;
    DWORD lpDataLength;
    auto res = Array::New(env);

    LSTATUS error;
    while(TRUE){
        lpcchValueName = VALUE_MAX - 1;
        lpDataLength = DATA_MAX - 1;
        if ((error = RegEnumValueW(key, index, (LPWSTR)&lpValueName, &lpcchValueName, NULL, &valueType, (LPBYTE)lpData, &lpDataLength)) != ERROR_SUCCESS) {
            if (error == ERROR_NO_MORE_ITEMS) {
                break;
            }
            return info.Env().Null();
        }
        

        auto obj = Object::New(env);
        auto jsName = String::New(env, reinterpret_cast<char16_t*>(lpValueName));
        obj.Set("name", jsName);
        obj.Set("type", Number::New(env, (uint32_t)valueType));

        if (valueType == REG_SZ) {
            lpData[lpDataLength] = 0;
            lpData[lpDataLength + 1] = 0;
            obj.Set("value", String::New(env, reinterpret_cast<char16_t*>(lpData)));
            // printf("%ls\n", lpValueName);
            // printf("%ls\n", lpcchValueName);
            // printf("%ls\n", lpData);
        }

        if (valueType == REG_EXPAND_SZ) {
        }
        if (valueType == REG_DWORD) {
        }
        if (valueType == REG_BINARY) {
        }
        if (valueType == REG_MULTI_SZ) {
        }
        res.Set(index++, obj);
    }

    RegCloseKey(key);
    return res;
};


Napi::Object Init(Napi::Env env, Napi::Object exports) {
  exports.Set("getKey", Napi::Function::New(env, getKey));
  return exports;
}

NODE_API_MODULE(addon, Init)