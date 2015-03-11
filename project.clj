(defproject mcda-patient "0.1.0-SNAPSHOT"

  :description "MCDA Application for eliciting patient preferences"
  :url "http://drugis.org"

  :dependencies [[org.clojure/clojure "1.6.0"]
                 [ring-server "0.3.1"]
                 [selmer "0.8.0"]
                 [com.taoensso/timbre "3.3.1"]
                 [com.taoensso/tower "3.0.2"]
                 [markdown-clj "0.9.64"]
                 [environ "1.0.0"]
                 [im.chit/cronj "1.4.3"]
                 [compojure "1.3.2"]
                 [ring/ring-defaults "0.1.3"]
                 [ring/ring-session-timeout "0.1.0"]
                 [ring-middleware-format "0.4.0"]
                 [noir-exception "0.2.3"]
                 [bouncer "0.3.2"]
                 [lib-noir "0.9.0"]
                 [prone "0.8.0"]
                 [buddy "0.3.0"]
                 [ragtime "0.3.8"]
                 [yesql "0.5.0-rc1"]
                 [crypto-random "1.2.0"]
                 [com.h2database/h2 "1.4.182"]]

  :min-lein-version "2.0.0"
  :uberjar-name "mcda-patient.jar"
  :repl-options {:init-ns mcda-patient.handler}
  :jvm-opts ["-server"]

  :main mcda-patient.core

  :plugins [[lein-ring "0.9.1"]
            [lein-environ "1.0.0"]
            [lein-ancient "0.6.0"]
            [ragtime/ragtime.lein "0.3.8"]]


  :ring {:handler mcda-patient.handler/app
         :init    mcda-patient.handler/init
         :destroy mcda-patient.handler/destroy
         :uberwar-name "mcda-patient.war"}

  :ragtime {:migrations ragtime.sql.files/migrations
            :database "jdbc:h2:./site.db"}


  :profiles {:uberjar {:omit-source true
                       :env {:production true}

                       :aot :all}
             :production {:ring {:open-browser? false
                                 :stacktraces?  false
                                 :auto-reload?  false}}
             :dev {:dependencies [[ring-mock "0.1.5"]
                                  [ring/ring-devel "1.3.2"]
                                  [pjstadig/humane-test-output "0.6.0"]]
                   :injections [(require 'pjstadig.humane-test-output)
                                (pjstadig.humane-test-output/activate!)]
                   :env {:dev true}}})
