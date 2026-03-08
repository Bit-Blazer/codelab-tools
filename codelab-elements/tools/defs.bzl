# Copyright 2018 Google Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#      http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

"""Repo's bazel rules and macros."""

load(
    "@io_bazel_rules_closure//closure:defs.bzl",
    _closure_js_binary_alias = "closure_js_binary",
)
load(
    "@io_bazel_rules_closure//closure:defs.bzl",
    _closure_js_library_alias = "closure_js_library",
)

def concat(ext):
    """Returns a genrule command to concat files with the extension ext."""
    return "ls $(SRCS) | grep -E '\\.{ext}$$' | xargs cat > $@".format(ext = ext)

def closure_js_library(**kwargs):
    """Invokes closure_js_library with non-test compilation defaults.

    Args:
      **kwargs: Additional arguments, passed to _closure_js_library_alias.
    """
    kwargs.setdefault("convention", "GOOGLE")
    suppress = kwargs.pop("suppress", [])
    suppress.append("JSC_UNKNOWN_EXPR_TYPE")
    kwargs.update(dict(suppress = suppress))
    _closure_js_library_alias(**kwargs)

def closure_js_binary(**kwargs):
    """Invokes closure_js_binary with non-test compilation defaults.

    Args:
      **kwargs: Additional arguments, passed to _closure_js_binary_alias.
    """
    kwargs.setdefault("compilation_level", "ADVANCED")
    kwargs.setdefault("dependency_mode", "PRUNE")
    kwargs.setdefault("language", "ECMASCRIPT5_STRICT")
    kwargs.setdefault("defs", [
        "--assume_function_wrapper",
        "--rewrite_polyfills=false",
        "--export_local_property_definitions",
        "--language_out=ES5_STRICT",
        "--isolation_mode=IIFE",
        "--generate_exports",
        "--hide_warnings_for=closure/goog",
    ])
    _closure_js_binary_alias(**kwargs)

